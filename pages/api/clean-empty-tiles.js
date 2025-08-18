import { MongoClient } from 'mongodb';
import sharp from 'sharp';

const url = process.env.MONGO_URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const DB_NAME = 'tilesDB';
let cachedCollection = null;

async function getMongoCollection() {
  if (cachedCollection) return cachedCollection;

  if (!client.topology?.isConnected()) {
    await client.connect();
  }

  const db = client.db(DB_NAME);
  cachedCollection = db.collection('cadastrMap');
  return cachedCollection;
}

function isBufferTransparent(buffer) {
  return sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      const { width, height, channels } = info;
      const pixelCount = width * height;
      let transparentCount = 0;

      for (let i = 0; i < pixelCount; i++) {
        const alpha = data[i * channels + 3];
        if (alpha === 0) transparentCount++;
      }

      const transparentRatio = transparentCount / pixelCount;
      return transparentRatio > 0.98;
    });
}

export default async function handler(req, res) {
  res.setHeader('Connection', 'keep-alive'); // 🧷 предотвращаем преждевременное закрытие

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Метод не поддерживается' });
    }

    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;

    const collection = await getMongoCollection();
    const total = await collection.countDocuments();

    console.log(`🧮 Всего тайлов в базе: ${total}`);
    console.log(`▶️ Обрабатываю от ${skip} до ${skip + limit - 1}`);

    const tiles = await collection.find({}).skip(skip).limit(limit).toArray();

    let checked = 0;
    let deleted = 0;

    for (const doc of tiles) {
      checked++;
      try {
        if (!doc.image?.buffer) continue;

        const buffer = Buffer.isBuffer(doc.image.buffer)
          ? doc.image.buffer
          : Buffer.from(doc.image.buffer?.buffer || []);

        const isTransparent = await isBufferTransparent(buffer);
        const tooSmall = buffer.length < 500;

        if (isTransparent || tooSmall) {
          await collection.deleteOne({ _id: doc._id });
          deleted++;
          console.log(
            `🗑️ Удалён пустой тайл z=${doc.z}, x=${doc.x}, y=${doc.y}, type=${doc.type}`
          );
        } else {
          console.log(`✅ Тайл z=${doc.z}, x=${doc.x}, y=${doc.y} — в порядке`);
        }
      } catch (err) {
        console.error(`❌ Ошибка обработки тайла _id=${doc._id}:`, err.message);
      }
    }

    const percent = (((skip + checked) / total) * 100).toFixed(2);

    return res.json({
      message: 'Очистка завершена для текущей страницы',
      всегоТайлов: total,
      проверено: checked,
      удалено: deleted,
      обработаноДо: skip + checked,
      прогресс: `${percent}%`,
    });
  } catch (error) {
    console.error('💥 Общая ошибка в handler():', error);
    return res.status(500).json({ error: error.message || 'Неизвестная ошибка' });
  }
}

import axios from "axios";
import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL;
let client; // Инициализируем клиент MongoDB глобально для повторного использования
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const egrpUrl = process.env.EGRP_URL;
const egrpUrl1 = process.env.EGRP_URL1;


// Функция обработки кадастрового номера
function processCadastralNumber(cadastralNumber) {
  const blocks = cadastralNumber.split(':');
  const processedBlocks = blocks.map(block => {
    if (block === '0') {
      return '0'; // если блок состоит из всех нулей, оставляем один ноль
    } else {
      let clearedBlock = block.replace(/^0+/, ''); // убираем ведущие нули
      if (clearedBlock === '') {
        return '0'; // если блок был полностью составлен из нулей, оставляем один ноль
      }
      return clearedBlock.replace(/(^|:)0+/g, '$1'); // убираем нули, оставляя по одному в каждом блоке
    }
  });
  return processedBlocks.join(':');
}

// Инициализация MongoDB клиента (один раз)
async function initMongoClient() {
  if (!client) {
    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
  }
}

// Основная функция обработки
export default async function tooltips(req, res) {
  const cadNumber = req.query.cadNumber;
  const objectId = req.query.objectid;
  const url = `${egrpUrl}${objectId}`;
  const url1 = `${egrpUrl1}${objectId}`;
  const encodeUrl = encodeURI(url);
  const encodeUrl1 = encodeURI(url1);
  // console.log('egrpUrl', encodeUrl)
  // console.log('egrpUrl1', encodeUrl1)
  let isFromBackup = false
  try {
    // Инициализируем MongoDB клиента, если не сделано ранее
    await initMongoClient();
    const db = client.db(process.env.MONGO_COLLECTION);
    const collection = db.collection('searchingObjects');

    // Пробуем выполнить первый запрос
    const { data: rightsData } = await axios({
      method: 'GET',
      timeout: 1000 * 10,
      url: encodeUrl
    });

    const processedObjectId = processCadastralNumber(cadNumber);
    // console.log('First request data:', rightsData);

    // Обновляем базу данных
    const updateResult1 = await collection.updateOne(
      { objectId: processedObjectId },
      { $set: { rights: rightsData } },
      { upsert: false }
    );
    isFromBackup = false
    // console.log('Update result (first request):', updateResult1);
    return res.json({rightsData, isFromBackup}); // Возвращаем ответ клиенту

  } catch (error) {
    // console.error('Error in first request:', error.message);

    // Если первый запрос не удался, пробуем второй запрос
    try {
      await initMongoClient();  // Убедимся, что Mongo клиент инициализирован
      const db = client.db(process.env.MONGO_COLLECTION);
      const collection = db.collection('searchingObjects');

      const { data: rightsData } = await axios({
        method: 'GET',
        timeout: 1000 * 10,
        url: encodeUrl1
      });

      const processedObjectId = processCadastralNumber(cadNumber);
      // console.log('Second request data:', rightsData);

      // Обновляем базу данных правами из второго запроса
      const updateResult2 = await collection.updateOne(
        { objectId: processedObjectId },
        { $set: { rights: rightsData?.rightEncumbranceObjects } },
        { upsert: false }
      );
      isFromBackup = true
      // console.log('Update result (second request):', updateResult2);
      return res.json({rightsData, isFromBackup}); // Возвращаем ответ клиенту

    } catch (secondError) {
      // console.error('Error in second request:', secondError.message);
      return res.status(500).json({ error: 'Failed to retrieve rights data from both sources' });
    }
  }
}

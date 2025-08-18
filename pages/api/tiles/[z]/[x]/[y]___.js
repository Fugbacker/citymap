import { MongoClient, Binary } from 'mongodb';
import axios from 'axios';
import { getBbox } from '../../../../../tiles-utils';
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import sharp from 'sharp';
import { getTileUrls } from "@/libs/urls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const url = process.env.MONGO_URL;
const client = new MongoClient(url, { useUnifiedTopology: true });
const DB_NAME = 'tilesDB';
let cachedClient = null;
let cachedCollection = null;

async function getMongoCollection() {
  if (cachedCollection) return cachedCollection;

  if (!cachedClient) {
    await client.connect();
  }

  const db = client.db(DB_NAME);
  cachedCollection = db.collection('cadastrMap');
  await cachedCollection.createIndex({ z: 1, x: 1, y: 1, type: 1 }, { unique: true });
  return cachedCollection;
}

let urlIndex = 0;

// Проверка изображения на "пустоту"
async function isImageEmpty(buffer) {
  try {
    const image = sharp(buffer);
    const { width, height, channels } = await image.metadata();
    if (!width || !height || channels < 3) return true;

    const raw = await image.ensureAlpha().raw().toBuffer();

    let transparentCount = 0;
    let whiteCount = 0;
    const totalPixels = width * height;

    for (let i = 0; i < raw.length; i += 4) {
      const r = raw[i];
      const g = raw[i + 1];
      const b = raw[i + 2];
      const a = raw[i + 3];

      if (a === 0) {
        transparentCount++;
      } else if (r > 240 && g > 240 && b > 240) {
        whiteCount++;
      }
    }

    const transparentRatio = transparentCount / totalPixels;
    const whiteRatio = whiteCount / totalPixels;

    return transparentRatio > 0.95 || whiteRatio > 0.95;
  } catch (err) {
    // console.error('[SHARP] Ошибка при анализе изображения:', err.message);
    return true;
  }
}

export default async function handler(req, res) {
  const userAgent = new UserAgent();
  let { z, x, y, type = '' } = req.query;

  y = y.replace('.png', '');
  z = parseInt(z);
  x = parseInt(x);
  y = parseInt(y);

  const bbox = getBbox(x, y, z);
  const mode = type === '36048' ? 'ZU' : type === '36049' ? 'BULDS' : 'ZU';

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await axios.get(`${baseUrl}/api/ips`);
  const ipsList = response.data;

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  const localIp = getRandomLocalIp();

  const urlTemplates = getTileUrls(type, mode, bbox, z, x, y);

  const rawTemplate = urlTemplates[urlIndex % urlTemplates.length];
  urlIndex++;
  const url = eval('`' + rawTemplate + '`');

  const collection = await getMongoCollection();

  try {
    const existing = await collection.findOne({ z, x, y, type });
    // console.log('ТАЙЛ НАЙДЕН В БАЗЕ', 'z', z, 'y', y, 'z', z, 'type', type)
    if (existing) {
      const isEmpty = await isImageEmpty(existing.image.buffer);
      if (!isEmpty && existing.image.buffer.length >= 500) {
        res.setHeader('Content-Type', existing.contentType || 'image/webp');
        return res.status(200).send(existing.image.buffer);
      } else {
        await collection.deleteOne({ z, x, y, type });
      }
    }
  } catch (error) {
    console.error('[MongoDB] Ошибка при чтении:', error);
  }

  console.log(`[FETCH] Запрашиваю с: ${url}`);
  const headers = {
    'Accept': 'image/avif,image/webp,*/*',
    'User-Agent': userAgent.toString(),
  };

  if (url.includes('geo.mapbaza.ru')) {
    headers['Host'] = 'geo.mapbaza.ru';
    headers['Referer'] = 'https://map.ru';
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers,
      httpAgent: new http.Agent({ localAddress: localIp }),
      httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      throw new Error(`Некорректный content-type: ${contentType} по этому URL: ${url}`);
    }

    let webpBuffer;

    if (contentType === 'image/webp') {
      webpBuffer = response.data;
    } else {
      webpBuffer = await sharp(response.data)
        .webp({ quality: 30 })
        .toBuffer();
    }

    const isEmpty = await isImageEmpty(webpBuffer);
    if (isEmpty || webpBuffer.length < 500) {
      // console.log('[SKIP] Не сохраняю пустой или маленький тайл');
      return res.status(204).end();
    }


    await collection.insertOne({
      z, x, y, type,
      image: new Binary(webpBuffer),
      contentType: 'image/webp',
    });

    res.setHeader('Content-Type', 'image/webp');
    res.status(200).send(webpBuffer);
  } catch (error) {
    console.error('[ERROR] Ошибка при получении тайла:', error?.response?.status || error.message, 'по URL:', url)
    res.status(500).json({ error: 'Не удалось получить изображение' });
  }
}

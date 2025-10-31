import { MongoClient, Binary } from 'mongodb';
import axios from 'axios';
import { getBbox } from '../../../../../tiles-utils';
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getTileUrls } from "@/libs/urls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const url = process.env.MONGO_URL

const client = new MongoClient(url, { useUnifiedTopology: true })
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
export default async function handler(req, res) {
  const userAgent = new UserAgent();
  let { z, x, y, type = '' } = req.query;
  console.log(`[Request] z: ${z}, x: ${x}, y: ${y}, type: ${type}`);
  y = y.replace('.png', '');
  z = parseInt(z);
  x = parseInt(x);
  y = parseInt(y);
  const bbox = getBbox(x, y, z);
  const mode = type === '36048' ? 'ZU' : type === '36049' ? 'BULDS' : 'ZU';

  const urlTemplates = getTileUrls(type, mode, bbox, z, x, y);
  const url = urlTemplates[urlIndex % urlTemplates.length];
  urlIndex++;
  // const url = eval('`' + rawTemplate + '`');
  // console.log(`[MongoDB] Проверка тайла в базе...`);
  const collection = await getMongoCollection();
  try {
    const existing = await collection.findOne({ z, x, y, type });
    if (existing) {
      console.log(`[MongoDB] Тайл найден в базе. Отдаю из Mongo.`);
      res.setHeader('Content-Type', existing.contentType || 'image/png');
      return res.status(200).send(existing.image.buffer);
    }
  } catch (error) {
    console.error(`[MongoDB] Ошибка при чтении:`, error);
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
      httpAgent: new http.Agent({ keepAlive: true, maxSockets: 50 }),
      httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 50, rejectUnauthorized: false }),
    });
    const contentType = response.headers['content-type'] || 'image/png';
    console.log(`[MongoDB] Сохраняю новый тайл в Mongo...`);
    await collection.insertOne({
      z, x, y, type,
      image: new Binary(response.data), // минимальный размер
    });
    res.setHeader('Content-Type', contentType);
    res.status(200).send(response.data);
  } catch (error) {
    console.error(`[ERROR] Ошибка при получении тайла:`, error?.response?.status || error.message);
    res.status(500).json({ error: 'Не удалось получить изображение' });
  }
}
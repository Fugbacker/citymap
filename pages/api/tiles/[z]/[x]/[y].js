// pages/api/tiles/[z]/[x]/[y].js

import { MongoClient, Binary } from 'mongodb';
import axios from 'axios';
import { getBbox } from '../../../../../tiles-utils';
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getTileUrls } from "@/libs/urls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// === Настройки MongoDB ===
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = 'tilesDB';
let cachedClient = null;
let cachedCollection = null;
let indexCreated = false;

// === Кэширование IP-адресов ===
let cachedIps = [];
let ipsLastFetched = 0;
const IPS_CACHE_TTL = 60 * 60 * 1000; // 5 минут

async function getLocalIps(baseUrl) {
  const now = Date.now();
  if (now - ipsLastFetched > IPS_CACHE_TTL) {
    const ipResponse = await axios.get(`${baseUrl}/api/ips`, { timeout: 3000 });
    cachedIps = ipResponse.data; // вы уверены, что всегда массив
    ipsLastFetched = now;
  }
  return cachedIps;
}

async function getMongoCollection() {
  if (cachedCollection) return cachedCollection;

  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    await cachedClient.connect();
  }

  const db = cachedClient.db(DB_NAME);
  cachedCollection = db.collection('cadastrMap');

  if (!indexCreated) {
    await cachedCollection.createIndex({ z: 1, x: 1, y: 1, type: 1 }, { unique: true });
    indexCreated = true;
  }

  return cachedCollection;
}

let urlIndex = 0;

export default async function handler(req, res) {
  // Кэширование на стороне клиента/CDN
  res.setHeader('Cache-Control', 'public, max-age=86400, immutable');

  const userAgent = new UserAgent();
  let { z, x, y, type = '' } = req.query;

  // Чистим значения
  if (typeof y === 'string') {
    y = y.replace('.png', '');
  }
  z = parseInt(z);
  x = parseInt(x);
  y = parseInt(y);

  if (z < 12) {
    console.warn(`[SKIP] Пропуск тайла с z=${z} (слишком малый зум)`);
    return res.status(204).end();
  }

  const bbox = getBbox(x, y, z);
  const mode = type === '36048' ? 'ZU' : type === '36049' ? 'BULDS' : 'ZU';

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  // Получаем закэшированный список IP
  const ipsList = await getLocalIps(baseUrl);
  const localIp = ipsList[Math.floor(Math.random() * ipsList.length)];

  const collection = await getMongoCollection();

  // --- 1. Проверка в базе ---
  try {
    const existing = await collection.findOne({ z, x, y, type });
    if (existing) {
      console.log(`[CACHE] Тайл найден: z=${z}, x=${x}, y=${y}, type=${type}`);
      return res.status(200).send(existing.image.buffer);
    }
  } catch (error) {
    console.error('[MongoDB] Ошибка при чтении:', error);
  }

  // --- 2. Загрузка с внешних источников ---
  const urlTemplates = getTileUrls(type, mode, bbox, z, x, y);

  const startIndex = urlIndex % urlTemplates.length;
  urlIndex++;

  let lastError = null;

  for (let i = 0; i < urlTemplates.length; i++) {
    const idx = (startIndex + i) % urlTemplates.length;
    const url = urlTemplates[idx];

    console.log(`[FETCH] Попытка ${i + 1}/${urlTemplates.length}: ${url}`);

    const headers = {
      'User-Agent': userAgent.toString(),
    };

    if (url.includes('geo.mapbaza.ru')) {
      headers['Host'] = 'geo.mapbaza.ru';
      headers['Referer'] = 'https://map.ru';
    }

    try {
      const tileResponse = await axios.get(url, {
        responseType: 'arraybuffer',
        headers,
        httpAgent: new http.Agent({ localAddress: localIp }),
        httpsAgent: new https.Agent({
          localAddress: localIp,
          rejectUnauthorized: false,
        }),
        timeout: 8000,
      });

      // --- Сохранение в БД ---
      try {
        await collection.updateOne(
          { z, x, y, type }, // уникальный ключ
          {
            $setOnInsert: {
              z, x, y, type,
              image: new Binary(tileResponse.data),
            }
          },
          { upsert: true }
        );
        console.log(`[SAVE] Тайл сохранён: z=${z}, x=${x}, y=${y}, type=${type}`);
      } catch (dbError) {
        if (!dbError.message.includes('duplicate key')) {
          console.error('[MongoDB] Ошибка сохранения:', dbError);
        }
      }

      // --- Ответ клиенту ---
      return res.status(200).send(tileResponse.data);
    } catch (error) {
      console.error(`[ERROR] Ошибка при получении тайла (${url}):`, error?.response?.status || error.message);
      lastError = error;
    }
  }

  // --- Все источники недоступны ---
  res.status(500).json({
    error: 'Не удалось получить изображение',
    details: lastError?.message || 'Все источники недоступны',
  });
}
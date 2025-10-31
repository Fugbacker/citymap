// pages/api/tiles/[z]/[x]/[y].js

import axios from 'axios';
import { getBbox } from '../../../../../tiles-utils'
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getTileUrls } from "@/libs/urls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
let urlIndex = 0;

export default async function handler(req, res) {
  const userAgent = new UserAgent();
  const { x, y } = req.query;
  const z = Number(req.query.z);

  if (z < 12) {
    console.warn(`[SKIP] Пропуск тайла с z=${z} (слишком малый зум)`);
    return res.status(204).end(); // 204 No Content (можно и 400 если нужно)
  }

  const type = req.query.type || '';
  const bbox = getBbox(parseInt(x), parseInt(y), parseInt(z));

  const mode = type === '36048' ? 'ZU' : type === '36049' ? 'BULDS' : 'ZU';

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  // получаем список локальных IP
  const response = await axios.get(`${baseUrl}/api/ips`);
  const ipsList = response.data;

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  const localIp = getRandomLocalIp();

  // список URL для перебора
  const urlTemplates = getTileUrls(type, mode, bbox, z, x, y);

  // сдвигаем индекс (чтобы не всегда начинать с одного и того же)
  const startIndex = urlIndex % urlTemplates.length;
  urlIndex++;

  let lastError = null;

  for (let i = 0; i < urlTemplates.length; i++) {
    const idx = (startIndex + i) % urlTemplates.length;
    const rawTemplate = urlTemplates[idx];
    const url = eval('`' + rawTemplate + '`');

    console.log(`[FETCH] Пытаюсь загрузить тайл: ${url}`);

    const headers = {
      'User-Agent': userAgent.toString(),
    };

    if (url.includes('geo.mapbaza.ru')) {
      headers['Host'] = 'geo.mapbaza.ru';
      headers['Referer'] = 'https://map.ru/';
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
      });

      // если получили успешный ответ, отдаем клиенту
      res.status(200).send(tileResponse.data);
      return;
    } catch (error) {
      console.error(
        `[ERROR] Ошибка при получении тайла (URL: ${url}):`,
        error?.response?.status || error.message
      );
      lastError = error;
      // продолжаем к следующему URL
    }
  }

  // если все варианты упали
  res.status(500).json({
    error: 'Не удалось получить изображение',
    details: lastError?.message || 'Все источники недоступны',
  });
}

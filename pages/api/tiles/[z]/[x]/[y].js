// pages/api/tiles/[z]/[x]/[y].js

import axios from 'axios';
import { getBbox } from '../../../../../tiles-utils'
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import sharp from 'sharp';
import { getTileUrls } from "@/libs/urls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
let urlIndex = 0;

export default async function handler(req, res) {
  const userAgent = new UserAgent()
  const { z, x, y } = req.query;
    console.log('z, x, y', z, x, y)
  const type = req.query.type || '';
  const bbox = getBbox(parseInt(x), parseInt(y), parseInt(z));

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

  console.log(`[FETCH] Запрашиваю с: ${url}`);
  const headers = {
    // 'Accept': 'image/avif,image/webp,*/*',
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

    // res.setHeader('Content-Type', 'image/webp');
    res.status(200).send(response.data);
  } catch (error) {
    console.error('[ERROR] Ошибка при получении тайла:', error?.response?.status || error.message, 'по URL:', url)
    res.status(500).json({ error: 'Не удалось получить изображение' });
  }
}

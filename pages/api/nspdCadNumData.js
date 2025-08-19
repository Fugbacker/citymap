import axios from "axios";
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getGeoportalUrls } from '@/libs/urls';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let lastSuccessfulIndex = -1;

export default async function chart(req, res) {
  const cadNum = req.query.cadNumber;
  const userAgent = new UserAgent();

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await axios.get(`${baseUrl}/api/ips`);
  const ipsList = response.data;

  const geoportalUrls = getGeoportalUrls(cadNum);

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  async function tryUrlsSequentially(startIndex, attemptsLeft) {
    if (attemptsLeft === 0) return null;

    const idx = startIndex % geoportalUrls.length;
    const randomIdx = Math.floor(Math.random() * geoportalUrls.length);
    const url = geoportalUrls[randomIdx];
    const localIp = getRandomLocalIp();

    try {
      console.log('TRY URL:', url);
      const response = await axios.get(encodeURI(url), {
        timeout: 3000,
        headers: {
          'User-Agent': userAgent.toString(),
        },
        httpAgent: new http.Agent({ localAddress: localIp }),
        httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
      });

      if (response?.data) {
        lastSuccessfulIndex = idx;
        return response.data;
      }

      return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
    } catch (e) {
      console.error(`Ошибка при запросе ${url}:`, e.message);
      return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
    }
  }

  const startFrom = (lastSuccessfulIndex + 1) % geoportalUrls.length;

  try {
    const data = await tryUrlsSequentially(startFrom, geoportalUrls.length);
    res.json(data || []);
  } catch (e) {
    res.json([]);
  }
}

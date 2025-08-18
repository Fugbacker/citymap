import axios from "axios";
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getHistoryUrls } from "@/libs/urls";


let lastSuccessfulIndex = -1;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const cadNumber = req.query.cadNumber
  const userAgent = new UserAgent();

  const host = req.headers.host; // например, localhost:3000 или domain.com
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  const ipsList = await axios.get(`${baseUrl}/api/ips`);

  const historyUrls = getHistoryUrls(cadNumber);

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  async function tryUrlsSequentially(startIndex, attemptsLeft) {
    if (attemptsLeft === 0) return null;

    const idx = startIndex % historyUrls.length;
    const url = historyUrls[idx];
    const localIp = getRandomLocalIp(); // 👈 выбираем IP

    try {
      const response = await axios({
        method: 'GET',
        url,
        timeout: 4000,
        headers: {
          'User-Agent': userAgent.toString(),
        },
        httpAgent: new http.Agent({ localAddress: localIp }),
        httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
      });

      if (response?.data) {
        lastSuccessfulIndex = idx;
        return response?.data?.data;
      }

      return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
    } catch (e) {
      return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
    }
  }

  const startFrom = (lastSuccessfulIndex + 1) % historyUrls.length;

  try {
    const data = await tryUrlsSequentially(startFrom, historyUrls.length);
    res.json(data || []);
  } catch (e) {
    res.json([]);
  }
}
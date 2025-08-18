import axios from "axios";
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';
import { getClickUrls } from "@/libs/urls";


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

let lastSuccessfulIndex = -1;

export default async function chart(req, res) {
  const bbox = req.query.bbox;
  const inputType = req.query.type;
  const convertedType = inputType === '36048' ? '1' : inputType === '36049' ? '2' : inputType;
  const userAgent = new UserAgent();

  const host = req.headers.host; // например, localhost:3000 или domain.com
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await axios.get(`${baseUrl}/api/ips`);
  const ipsList = response.data;

  const clickUrls = getClickUrls(inputType, convertedType, bbox);

  // 🔁 Случайный выбор IP
  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  async function tryUrlsSequentially(startIndex, attemptsLeft) {
    if (attemptsLeft === 0) return null;

    const idx = startIndex % getClickUrls.length;

    const randomIdx = Math.floor(Math.random() * clickUrls.length);

    const url = clickUrls[randomIdx];
    console.log('CLICKURL', url)
    const localIp = getRandomLocalIp(); // 👈 выбираем IP

    try {
      const response = await axios({
        method: 'GET',
        url,
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
      return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
    }
  }

  const startFrom = (lastSuccessfulIndex + 1) % clickUrls.length;

  try {
    const data = await tryUrlsSequentially(startFrom, clickUrls.length);
    res.json(data || []);
  } catch (e) {
    res.json([]);
  }

}

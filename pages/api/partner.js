import axios from "axios"
import https from 'https';
import UserAgent from 'user-agents';

const userAgent = new UserAgent()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function success(req, res) {
 try {
  const cadastr = req.query.cadNumber
  const cadNum = cadastr.trim()
  const fetchData1 = async (url) => {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // НЕБЕЗОПАСНО, но если нужен самоподписанный сертификат — оставить
        keepAlive: true, // Сохраняем соединение дольше
        secureProtocol: 'TLSv1_2_method', // Явно указываем TLS 1.2
      });

      const { data } = await axios.get(url, {
        httpsAgent,
        timeout: 2000,
        headers: {
          'User-Agent': userAgent.toString(),
          'Host': 'nspd.gov.ru',
        },
      });

      return data;
    } catch (e) {
      console.error(`Ошибка при запросе ${url}:`, e.message);
      return null;
    }
  };

  let cadastrObj = await fetchData1(`https://nspd.gov.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNum}`);

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNum}`)
  }

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNum}`);
  }

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`);
  }

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`);
  }

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNum}`);
  }

  return res.json(cadastrObj)
 }
 catch {
  res.json([])
 }
}

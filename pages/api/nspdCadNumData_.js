import axios from "axios"
import UserAgent from 'user-agents';
import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default async function chart(req, res) {
  const cadNum = req.query.cadNumber

  const userAgent = new UserAgent()
  const fetchData1 = async (url) => {
    try {
      const { data } = await axios.get(url, {
        // httpsAgent,
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


  // let cadastrObj = await fetchData1(`https://a.balour.ru/pkk.php?mode=s&cd=${cadNum}`);
  let cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNum}`);

  if (!cadastrObj) {
    cadastrObj = await fetchData1(`https://nspd.gov.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNum}`)
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

  if (!cadastrObj) {
    return res.json([])
  }

  return res.json(cadastrObj)
}
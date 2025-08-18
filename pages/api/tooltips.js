import axios from "axios"
// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
import UserAgent from 'user-agents';
import http from 'http';
import https from 'https';


const toolTipsUrl = process.env.TOOLTIPS_URL
export default async function tooltips(req, res) {
  const text = req.query.text
  const userAgent = new UserAgent();

  const host = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = `${protocol}://${host}`;

  const response = await axios.get(`${baseUrl}/api/ips`);
  const ipsList = response.data;

  const getRandomLocalIp = () =>
    ipsList[Math.floor(Math.random() * ipsList.length)];

  const localIp = getRandomLocalIp();

  try {
    const arrayOfAddresses = text.split("|").filter(it => it !== 'null')
    const address = arrayOfAddresses.join(' ')
    const url = `https://mobile.rosreestr.ru/api/v1/address?term=${address}`
    const encodingUrl = encodeURI(url)
    const getAskByReestrByAdress = await axios({
      method: 'GET',
      httpAgent: new http.Agent({ localAddress: localIp }),
      httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
      headers: {
          'User-Agent': userAgent.toString(),
        },
        timeout: 1000 * 5,
        url: encodingUrl,
      })
    let result = getAskByReestrByAdress?.data

    return res.json(result)
  }
   catch {
      try{
      const arrayOfAddresses = text.split("|").filter(it => it !== 'null')
      const address = arrayOfAddresses.join(' ')
      const url = `https://gcadastr.su/api/tooltips?address=${address}`
      const encodingUrl = encodeURI(url)
      const getAskByReestrByAdress = await axios({
        method: 'GET',
          timeout: 1000 * 5,
          url: encodingUrl,
        })

      let result = getAskByReestrByAdress?.data
      return res.json(result)
    } catch {
      try {
        const arrayOfAddresses = text.split("|").filter(it => it !== 'null')
        const address = arrayOfAddresses.join(' ')
        const url = `${toolTipsUrl}${address}`
        const encodingUrl = encodeURI(url)
        const getAskByReestrByAdress = await axios({
          httpAgent: new http.Agent({ localAddress: localIp }),
          httpsAgent: new https.Agent({ localAddress: localIp, rejectUnauthorized: false }),
          headers: {
              // 'Access-Control-Allow-Origin': '*',
              'User-Agent': userAgent.toString(),
              'Host': 'lk.rosreestr.ru',
            },
            method: 'GET',
            timeout: 1000 * 5,
            url: encodingUrl
          })

        let result = getAskByReestrByAdress.data
        return res.json(result)
      } catch (error) {
        return res.json('error')
      }
    }
  }
}

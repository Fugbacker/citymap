import axios from "axios"
import * as https from "https";

export default async function inn(req, res) {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

  const phone = req.query.phone
  const url = `http://opendata.digital.gov.ru/api/v1/abcdef/phone?num=${phone}`
  const encodeUrl = encodeURI(url)
  const askGos = await axios.get(encodeUrl, { httpsAgent })
  console.log('askGos', askGos.data)
  const inn = askGos?.data?.data[0]?.inn

  return res.json(inn)
}
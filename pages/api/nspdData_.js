import axios from "axios"
import UserAgent from 'user-agents';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const bbox = req.query.bbox
  const type = req.query.type
  const userAgent = new UserAgent()

  try {
    // const url = `https://nspd.gov.ru/api/aeggis/v3/${type}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${type}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${type}&RANDOM=0.34806718283014204&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=408&J=70&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`

    // const url = `https://nspd.gov.ru/api/aeggis/v4/${type}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${type}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${type}&RANDOM=0.6446712850778707&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`

    const url = `https://balour.ru/pkk.php?mode=1&bbox=${bbox}&HEIGHT=512&WIDTH=512`


    let nspdData = await axios({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Host': 'balour.ru',
        'Priority': 'u=1',
        'Connection': 'keep-alive',
        // 'Referer': 'https://nspd.gov.ru/map',
        'rejectUnauthorized': false,
        'User-Agent': userAgent.toString(),
      },
      method: 'GET',
      timeout: 1000 * 6,
      url: url
    })

    return res.json(nspdData.data)

  } catch {
    try {

      const url = `https://ns2.mapbaza.ru/api/aeggis/v4/36048/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=36048&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=36048&RANDOM=0.6446712850778707&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`
      console.log('url2', url)
      let nspdData = await axios({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Host': 'ns2.mapbaza.ru',
          'Priority': 'u=1',
          'Connection': 'keep-alive',
          'Referer': 'https://nspd.gov.ru/map',
          'rejectUnauthorized': false,
          'User-Agent': userAgent.toString(),
        },
        method: 'GET',
        timeout: 1000 * 6,
        url: url
      })

      return res.json(nspdData.data)

    } catch {
      return res.json([])
    }
  }
}
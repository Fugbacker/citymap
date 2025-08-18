import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const text = req.query.text

  try {

    const url = `https://ns2.mapbaza.ru/api/geoportal/v2/search/geoportal?query=${text}`
    console.log('url', url)
    let nspdData = await axios({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Host': 'nspd.gov.ru',
        'Priority': 'u=1',
        'Connection': 'keep-alive',
        'Referer': 'https://nspd.gov.ru/map?thematic=PKK',
        'rejectUnauthorized': false,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
      },
      method: 'GET',
      timeout: 1000 * 7,
      url: encodeURI(url)
    })

    return res.json(nspdData?.data?.data)

  } catch {
    const url = `https://ns2.mapbaza.ru/api/geoportal/v2/search/cadastralPrice?query=${text}`
    console.log('url1', url)
    try{
      let nspdData = await axios({
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Host': 'nspd.gov.ru',
          'Priority': 'u=1',
          'Connection': 'keep-alive',
          'Referer': 'https://nspd.gov.ru/map?thematic=PKK',
          'rejectUnauthorized': false,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
        },
        method: 'GET',
        timeout: 1000 * 7,
        url: encodeURI(url)
      })

      return res.json(nspdData?.data?.data)
    } catch {
      return res.json([])
    }

  }
}



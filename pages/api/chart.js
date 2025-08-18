import axios from "axios"

export default async function chart(req, res) {
  const comm_sq = req.query.comm_sq
  const regionGuid = req.query.regionGuid
  const marketPrice = req.query.marketPrice

  const rooms = (area) => {
    if (area <= 35) {
      return 1
    }
    if (area > 35 && area <= 55) {
      return 2
    }
    if (area > 55 && area <= 70) {
      return 3
    }
    else {
      return 4
    }
  }

  const url = `https://price-charts.domclick.ru/api/v1/flat/predicted_price?predicted_price=${marketPrice}&region_guid=${regionGuid}&rooms=${rooms(comm_sq)}`
  const encodeUrl = encodeURI(url)
  const askChart = await axios({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
      'Access-Control-Allow-Origin': '*',
    },
    method: 'GET',
    timeout: 1000 * 15,
    url: encodeUrl
  })

  if (askChart.data.answer === null) {
    return res.json('Не смогли определить цену')
  }
  return res.json(askChart.data.answer)
}
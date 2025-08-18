import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const lat = req.query.lat
  const lng = req.query.lng
    try {
      const decodnigUrl = `https://epsg.io/srs/transform/${lat},${lng}.json?key=default&s_srs=3857&t_srs=4326`
      const decodingCenterCoordinate = await axios({
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        method: 'GET',
        timeout: 1000 * 15,
        url: decodnigUrl
      })


      return res.json(decodingCenterCoordinate.data)
    } catch {
      return res.json('error')
    }
  }
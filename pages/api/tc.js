import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const data = req.body
  try {
    const x = data.x;
    const y = data.y;
    const response = await axios(`https://epsg.io/srs/transform/${x},${y}.json?key=default&s_srs=3857&t_srs=4326`)
    return res.json(response.data.results[0])

  } catch {
    return res.json('error')
  }
}
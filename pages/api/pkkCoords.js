import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const { latitude, longitude } = req.query;
  const encodeUrl = encodeURI(`https://pkk.torgi.me/api/features/1?sq={"type":"Point","coordinates":[${latitude},${longitude}]}&tolerance=1&limit=11`);

  console.log('encodeUrlPKKCOORDS', encodeUrl)
  try {
    const response = await axios({
      headers: {
        'Host': 'pkk.torgi.me',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0'
      },
      method: 'GET',
      timeout: 6000, // Тайм-аут 6 секунд
      url: encodeUrl,
    });

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(200).json({
      features: []});
  }
}
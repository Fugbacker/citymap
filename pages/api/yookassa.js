import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const toolTipsUrl = process.env.TOOLTIPS_URL
const cadastrUrl = process.env.CADASTR_URL

export default async function tooltips(req, res) {
  const domain = req.headers.host
  const fullOrder = req.body
  const summa = fullOrder?.summa

  try {
    const {data} = await axios(({
      method:'POST',
      url:'https://api.yookassa.ru/v3/payments',
      headers: {
        'Content-type': 'application/json',
        'Idempotence-key': Date.now()
      },
      auth: {
        username: '1124414',
        password: 'live_jAqM81GhRuAu9mvu3zLaef26dHEy1y5qSmvNBNHUl3Y'
      },
      data: {
        amount: {
          value: summa,
          currency: 'RUB'
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          // return_url:`https://${domain}/kadastr/${cadNumber}`
          return_url:`https://${domain}/result/${fullOrder?.orderNumber}`
        },
        description: fullOrder?.orderNumber
      }
    }))

    return res.json(data)
  }
   catch {
    return res.json('error')
  }
}

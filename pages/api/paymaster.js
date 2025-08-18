import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const toolTipsUrl = process.env.TOOLTIPS_URL
const cadastrUrl = process.env.CADASTR_URL

export default async function tooltips(req, res) {
  const fullOrder = req.body
  console.log('fullOrder', fullOrder)
  const summa = fullOrder?.summa

  // try {
    const {data} = await axios(({
      method:'POST',
      url:'https://paymaster.ru/api/v2/invoices',
      headers: {
        'Authorization': 'Bearer 1030c830fd69b68023b7d27208a4c65159593c85bbbd186f346bbfbccdf6bfd1366c79c80f168f262bc1e048e3d37deab842',
        'Idempotence-key': Date.now(),
        'Content-Type': 'application/json'
      },
      data: {
        merchantId: "f643dfbf-76b5-4b9a-9f7e-0921ce1bd663",
        invoice: {
          description: "test payment",
          params: {
            "BT_USR": "34"
          }
        },
        amount: {
          value: summa,
          currency: 'RUB'
        },
        paymentMethod: "BankCard",
      }
    }))

    return res.json(data)
  // }
  //  catch {
  //   ((e) => console.log('ERROR_TOOLTIPS', e.status))
  //   return res.json('error')
  // }
}

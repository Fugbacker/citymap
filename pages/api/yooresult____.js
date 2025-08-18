import { MongoClient } from 'mongodb'
import { mailer } from '../../config/nodemailer'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function result(req, res) {
  const resultData = req.body
  const order = resultData?.object?.description
  const incomeSumma = resultData?.object?.income_amount?.value

  // Функция для удаления ведущего нуля из строки
  // function removeLeadingZero(inputString) {
  //   if (inputString.startsWith('0')) {
  //     return inputString.slice(1);
  //   }
  //   return inputString;
  // }

  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('goscadastrOrders')
  await collection.updateOne({orderNumber: order}, { $set: {status: 'payed'}})
  const orderData = await collection.findOne({orderNumber: order})
  const address = orderData?.address
  const clientEmail = orderData?.email
  const numberOfOrder = orderData?.orderNumber
  const cadNumber = orderData?.cadastrNumber
  const summa = orderData?.summa
  const arrayOfRaports = orderData?.kindOfRaports
  const reestrChecker = orderData?.reestrChecker

  const data = new Date()
  const year = data.getFullYear()
  const month = `0${data.getMonth()+1}`
  const monthReal = month.length > 2 ? month.slice(1) : month
  const day = data.getDate()
  const hour = data.getHours()
  const minutes = data.getMinutes()

  const outputObject = () => {
    if (!reestrChecker) {
      return arrayOfRaports.map((it, index) => {
        return <li key={index}>{`${cadNumber} - ${it}`}</li>
      })
    } else {
      return arrayOfRaports.map((it, i) => {
        return <li key={i}>{`${it} - ${address}`}</li>
      })
    }
  }

  const message = {
    from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
    to: clientEmail,
    subject: `Вы оплатили заказ №${numberOfOrder} на сайте cadmap.su`,
    html: `
    <p>Здравствуйте. Мы получили оплату и уже работаем над вашим заказом №${numberOfOrder}.</p>
    <p><b>В работе следующие услуги:</b></p>
    <ul>
    ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
    </ul>
    <p>Заказ будет отправлен на указанный почтовый ящик сразу же после исполнения.</p>
    <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>`
  }

  await mailer(message)

  const adminMessage = {
    from: clientEmail,
    to: 'admin@cadmap.su',
    subject: 'Уведомление о новом платеже',
    html:`
    <p>Поступил новый заказ</p>
    <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
    <p><b>Заказанные услуги:</b></p>
    ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
    <p>Номер заказа: <b>${numberOfOrder}</b></p>
    <p>Сумма заказа: <b>${summa}</b></p>
    <p>Сумма дохода: <b>${incomeSumma}</b></p>
    `
  }

  await mailer(adminMessage)

  res.status(200).send('ok')
}
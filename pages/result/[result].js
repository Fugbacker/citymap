import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Search } from "@/Components/search"
import Breadcrumbs from "@/Components/breadcrumbs"
import { MongoClient } from 'mongodb'
import axios from "axios"


const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default function Main() {

  return (
    <>
      <div className="first">
        <Header />
          <div className="pledge pageArrest">
            <div className="mainCadastr">
              <div className="content1">
                <Breadcrumbs />
                <Search />
              </div>
            </div>
          <div className="content1">
            <div className="pledge__main">
              <div className="pledge__content">
                <div className="pledge__single _show _check">
                  <h1 className="pledge__title">Уважаемый клиент, платеж успешно завершен</h1>
                  <div className="pledge__desc">
                    <p>Ваш заказ поступил в обработку. На указанный вами e-mail отправлено сообщение с детальной информацией по заказу. Обязательно проверьте, поступило ли вам это сообщение. Если оно отсутствует, проверьте, верно ли вы указали электронный почтовый ящик при оформлении заказа. В случае выявления ошибки, сообщите нам об этом. Если ваш электронный ящик расположен на почтовом сервере mail.ru, сообщение может прийти с небольшой задержкой.</p><br /><br />
                    <p>Примерный срок получения отчета составляет 24 часа, но он может быть увеличен при высокой загруженности серверов.</p>
                    <p>По всем вопросам вы можете обратиться в службу поддержки по указанным на сайте контактам.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  const referer = context?.req?.headers?.referer
  const orderNumber = context?.params?.result

  if (referer !== 'https://yoomoney.ru/') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('goscadastrOrders')
  const order = await collection.findOne({orderNumber})
  const paymentId = order?.paymentId
  const {data} = await axios({
    method:'GET',
    url: `https://api.yookassa.ru/v3/payments/${paymentId}`,
    headers: {
      'Content-type': 'application/json',
    },
    auth: {
      username: '1124414', //'501627',
      password: 'live_jAqM81GhRuAu9mvu3zLaef26dHEy1y5qSmvNBNHUl3Y' //'test_REd92lfdF3-xDVl_6B1C42sxUew5KiFiiQs7f0-qMz8'
    },
  })
  const status = data?.status

  if (status === 'succeeded') {
    return {
      redirect: {
        destination: '/success',
        permanent: false,
      },
    }
  }

  else {
    return {
      redirect: {
        destination: '/fail',
        permanent: false,
      },
    }
  }


  // return {
  //   props: {'1':'1'}
  // }
}


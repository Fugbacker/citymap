import React, { useEffect } from 'react'
import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Search } from "@/Components/search"
import Breadcrumbs from "@/Components/breadcrumbs"
import { MongoClient } from 'mongodb'
import axios from "axios"
import { useRouter } from 'next/router'


const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default function Main({ yokassaUrl }) {
  const router = useRouter()
  const paymentUrl = yokassaUrl && JSON.parse(yokassaUrl)

  useEffect(() => {
    router.push(paymentUrl)
  }, [paymentUrl])

  return (
    <>
      {/* <div className="first">
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
      </div> */}
    </>
  )
}

export async function getServerSideProps(context) {
  const referer = context?.req?.headers?.referer
  const dataFromMail = context?.params?.discount.split('|')
  const orderNumber = dataFromMail[0]
  const summa = dataFromMail[1]

  // if (referer !== 'https://yoomoney.ru/') {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   }
  // }


const {data} = await axios(({
    method:'POST',
    url:'https://api.yookassa.ru/v3/payments',
    headers: {
      'Content-type': 'application/json',
      'Idempotence-key': Date.now()
    },
    auth: {
      username: '1124414', //'501627',
      // username: '501627', //'test',
      password: 'live_jAqM81GhRuAu9mvu3zLaef26dHEy1y5qSmvNBNHUl3Y' //'test_REd92lfdF3-xDVl_6B1C42sxUew5KiFiiQs7f0-qMz8'
      // password: 'test_REd92lfdF3-xDVl_6B1C42sxUew5KiFiiQs7f0-qMz8'
    },
    data: {
      amount: {
        value: summa,
        currency: 'RUB'
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url:`https://cadmap.su/result/${orderNumber}`
      },
      description: orderNumber
    }
  }))

  if (data) {
    await client.connect()
    const db = client.db(process.env.MONGO_COLLECTION)
    const collection = db.collection('goscadastrOrders')
    await collection.updateOne({orderNumber : 'orderNumber'}, {$set: {paymentId : data?.id}})

    // setOrderComplete(true)
    const yookassPaymentUrl = data?.confirmation?.confirmation_url

    return {
      props: {yokassaUrl: JSON.stringify(yookassPaymentUrl) || null}
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}


import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Search } from "@/Components/search"
import Breadcrumbs from "@/Components/breadcrumbs"

export default function Main() {

  return (
    <>
      <div className="first">
        <Header />
          <div className="pledge pageArrest">
            <div className="mainCadastr">
              <div className="content1">
                {/* <Breadcrumbs /> */}
                {/* <Search /> */}
              </div>
            </div>
          <div className="content1">
            <div className="pledge__main">
              <div className="pledge__content">
                <div className="pledge__single _show _check">
                  <h1 className="pledge__title">Уважаемый клиент, платеж успешно завершен</h1>
                  <div className="descContainer">
                    <div className="descLogo"></div>
                    <div className="pledge__desc">
                      <p className="descrParagraph">Ваш заказ поступил в обработку. На указанный вами e-mail отправлено сообщение с детальной информацией по заказу. Обязательно проверьте, поступило ли вам это сообщение. Если оно отсутствует, проверьте, верно ли вы указали электронный почтовый ящик при оформлении заказа.</p>
                      <p className="descrParagraph1">В случае выявления ошибки, сообщите нам об этом. Если ваш электронный ящик расположен на почтовом сервере mail.ru, сообщение может прийти с небольшой задержкой.</p>
                      <p className="descrParagraph1">Примерный срок получения отчета составляет 24 часа, но он может быть увеличен при высокой загруженности серверов. По всем вопросам вы можете обратиться в службу поддержки по указанным на сайте контактам.</p>
                    </div>
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

  if (referer !== 'https://yoomoney.ru/') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {'1':'1'}
  }
}


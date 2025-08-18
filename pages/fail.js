
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
                  <h1 className="pledge__title">Уважаемый клиент, платеж не завершен</h1>
                  <div className="descContainer">
                    <div className="descLogo1"></div>
                    <div className="pledge__desc">
                      <p className="descrParagraph">Скорее всего платеж был отменен или возникли проблемы с его обработкой. Если вы не отменяли платеж и уверены что для оплаты заказа достаточно средств, попробуйте провести платеж еще раз.</p>
                      <p className="descrParagraph">Если же вы успешно завершили платеж, то вам не стоит беспокоиться, так как на указанный почтовый ящик будет отпрвлено письмо с информацией о заказе.</p>
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


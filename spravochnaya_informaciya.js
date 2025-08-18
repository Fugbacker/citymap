import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import { Search } from "../Components/search"
import { Header } from "../Components/header"
import { Footer } from "../Components/footer"
import { FakeOrders } from '@/Components/fakeOrders'
import Scroll from '@/Components/scroll'
import Meta from '@/Components/meta'
import style from '../styles/File.module.css'

export default function Home() {
  const [model, setModel] = useState(false)
  const [tempImg, setTempImg] = useState('')
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [cadastrData, setCadastrData] = useState([])

  const showNotification = () => {
    setIsNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsNotificationVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNotification();
      setTimeout(() => {
        hideNotification();
      }, 7000); // Устанавливаем время показа уведомления (в миллисекундах)
    }, Math.floor(Math.random() * 11000) + 15000); // Рандомный интервал от 10 до 20 секунд

    return () => clearInterval(interval);
  }, []);

  const getImg = (img) => {
    setTempImg(() => img)
    setModel(true)
  }

  // const [showComebacker, setShowComebacker] = useState(false);
  // console.log('showComebacker', showComebacker)

  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     const { clientX, clientY } = e;

  //     console.log('clientX', clientX)
  //     console.log('clientY', clientY)

  //     // Проверяем, находится ли курсор в верхнем правом углу экрана (например, в пределах 10 пикселей)
  //     if (clientY <= 2) {
  //       setShowComebacker(true);
  //     } else {
  //       setShowComebacker(false);
  //     }
  //   };

  //   window.addEventListener('mousemove', handleMouseMove);

  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, []);

  return (
    <>
      <Meta
        title={`Бесплатная справочная информация по объектам недвижимости в режиме online|Бесплатные кадастровые сведения из Росреестра об объектах недвижимости онлайн.`}
        descritoin={`Бесплатные справочная кадастровая информация из росреестра об объектах недвижимости в режиме онлайн.`}
        keywords={`справочная информация по объектам недвижимости в режиме online, справочная информация по объектам недвижимости, справочная росреестра, сведения об объектах недвижимости в режиме онлайн, справочная информация информация об объектах недвижимости в режиме онлайн`}
        canonicalURL={`https://gockadastr.site/spravochnaya_informaciya`}
        robots='index, follow'
        ogUrl={`https://gockadastr.site/spravochnaya_informaciya`}
        ogTitle={`Бесплатная справочная информация по объектам недвижимости в режиме online|Бесплатные кадастровые сведения из Росреестра об объектах недвижимости онлайн.`}
        ogDescrition={`Бесплатные справочная кадастровая информация из росреестра об объектах недвижимости в режиме онлайн.`}
        twitterTitle={`Бесплатная справочная информация по объектам недвижимости в режиме online|Бесплатные кадастровые сведения из Росреестра об объектах недвижимости онлайн.`}
        twitterDescription={`Бесплатные справочная кадастровая информация из росреестра об объектах недвижимости в режиме онлайн.`}
      />
      <Header />
      <div className={model ? `${style.model} ${style.open}` : `${style.model}`}>
        <img src={tempImg} alt="" aria-hidden="true" onClick={() => setModel(false)} />
        {/* <CloseIcon onClick={() => setModel(false)} /> */}
      </div>
          <div className={`${style.section} ${style.content} ${style.blue}`}>
              <div className={style.content1}>
          <h1>Справочная информация по объектам недвижимости в режиме online</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>
                  Справочная информация информация об объектах недвижимости в режиме онлайн -  это электронный сервис, позволяющий получить кадастровые сведения по любому объекту недвижимости, произведя поиск по кадастровому номеру или адресу.</p>
              </div>
              <div className={style.servicePictureFaq}></div>
            </div>
          <Search cadastrData={cadastrData} setCadastrData={setCadastrData}/>
        </div>
      </div>
      {cadastrData.length === 0 &&
        <>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div>
                    <div className={`${style["object__block-title"]}`}><h2>Бесплатная справочная информация по объектам недвижимости.</h2></div>
                        <div className={style.contentText}>
                          <p>Электронный сервис cправочная информация по объектам недвижимости в режиме онлайн предоставляет круглосуточный доступ к актуальным данным об объектах недвижимости. Данный сервис является незаменимым помощником для физических и юридических лиц, обеспечивая быстрый и удобный способ получения важных сведений, касаемо объектов недвижимости.</p>
                      </div>
                    </div>
                </div>
              </div>
          </div>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
              <div className={style.object__block}>
                  <div>
                     <div className={`${style["object__block-title"]}`}><h2>Какие сведения об объектах недвижимости в режиме онлайн	можно узнать</h2></div>
                        <div className={style.contentText}>
                          <p>Основным преимущество кадастрового сервиса заключается в возможности моментального получения справочной информации росреестра по искомому объекту недвижимости, которая включает в себя:</p>
                          <ul>
                            <li>Кадстровый номер объекта недвижимости;</li>
                            <li>Фактический адрес;</li>
                            <li>Технические кадастровые сведения об объекте недвижимости;</li>
                            <li>Наличие или отсуствие прав и собственников;</li>
                            <li>Обременения, ограничения и аресты, при их наличии.</li>
                          </ul>
                      </div>
                    </div>
                </div>
              </div>
          </div>
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
              <div className={style.object__block}>
                  <div>
                    <div className={`${style["object__block-title"]}`}> <h2>Как получить справочную информацию по объектам недвижимости?</h2></div>
                      <div className={style.infoblock}>
                        <div className={style.text}>
                          <p>Для того чтобы воспользоваться сервисом необходимо:</p>
                          <ul>
                              <li>Перейдите по ссылке «Справочная информация по объектам недвижимости в режиме online».</li>
                              <li>Введите кадастровый номер или адрес объекта недвижимости.</li>
                              <li>Нажмите кнопку «Поиск».</li>
                          </ul>
                          <p>Если в справочной содержатся данные по искомому объекту недвижимости, они отобразятся на экране.</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
          </div>
        </>
      }
      {isNotificationVisible && (
        <FakeOrders onClose={hideNotification} />
      )}
      {/* <Scroll /> */}
      <Footer />
    </>
  )
}

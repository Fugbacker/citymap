import React, { useState, useEffect } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from 'next/router';
import axios from 'axios'
import PromoCode from './promoCode';
import { Link } from 'react-scroll'
import style from '../styles/File.module.css'
import { ModalPaymentsWindow } from './modalPaymentsWindow';

const md5 = require('md5')

export const EgrulDataReport = ({ addedRaports, cadNumber, summa, arrayOfprice, activate, sendActivePromoCode, promoCode, setPromoCode, setActivate, isVisible, check}) => {
  const [newSum, setNewSum] = useState(true)
  const [privacy, setPrivacy] = useState(true)
  const [mail, setMail] = useState('')
  const [promo, setPromo] = useState('')
  const [checkPromo, setCheckPromo] = useState(false)
  const [mailDirty, setMailDirty] = useState(false)
  const [promoDirty, setPromoDirty] = useState(false)
  const [mailError, setMailError] = useState('Введите почтовый ящик')
  const [raportCheckAlarm, setRaportCheckAlarm] = useState(false)
  const [validForm, setValidForm] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [modalActive, setModalActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if(activate) {
      const persent = '20%';
      setNewSum([summa - (summa / 100 * parseFloat(persent))])
    } else {
      setNewSum([summa])
    }
  }, [summa])

  useEffect(() => {
    autoPromoHandler(sendActivePromoCode)
  }, [sendActivePromoCode])

  function handleChange (event) {
    const {checked} = event.target
    if (checked) {
      setPrivacy(true)
    } else {
      setPrivacy(false)
    }
  }

  useEffect(() => {
    if (mailError || !privacy || addedRaports.length === 0) {
      setValidForm(false)
    } else {
      setValidForm(true)
    }
  }, [mailError, privacy, addedRaports])

  const mailHandler = (e) => {
    setMail(e.target.value)
    const regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
    if (!regexp.test(String(e.target.value).toLowerCase().replace(/\s/g, ''))) {
      setMailError('Введите корректный почтовый ящик')
    } else {
      setMailError('')
    }
  }

  const blurHandler = (e) => {
    if (e.target.name) {
      setMailDirty(true)
    }
  }

  const blurHandler1 = (e) => {
    if (e.target.name) {
      setPromoDirty(true)
    }
  }

  const promoHandler = (e) => {
    setPromo(e.target.value)
    if(e.target.value === promoCode) {
      setCheckPromo([true, ''])
      const persent = '20%';
      setNewSum([summa - (summa / 100 * parseFloat(persent))])
    }
    else if (e.target.value === 'LOVER9') {
      setCheckPromo([true, ''])
      const persent = '99%';
      setNewSum([summa - (summa / 100 * parseFloat(persent))])
    }
    else {
      setCheckPromo([false,'Введен неверный промокод, скидка не применилась'])
      setNewSum([summa])
    }
  }

  const autoPromoHandler = (object) => {
    setPromo(object)
    if(object === promoCode && promoCode) {
      setCheckPromo([true, ''])
      const persent = '20%';
      setNewSum([summa - (summa / 100 * parseFloat(persent))])
    } else {
      setCheckPromo([false,'Введен неверный промокод, скидка не применилась'])
      setNewSum([summa])
    }
  }

  const handleClick = async () => {
    if (!validForm) {
      // Если форма не валидна, срабатывает другой useState
      setMailDirty(true);
      if (!validForm && mailDirty && check.length === 0) {
        setRaportCheckAlarm('Отметьте необходимые документы');
        return;
      }
      return;
    }

    setLoading(true);
    await orderGeneration(order, addedRaports, mail, cadNumber, summa, date);
  };

  async function orderGeneration (orderNumber, kindOfRaports, email, cadastrNumber, summa, date) {
    await axios({
       method: 'POST',
       url: '/api/yookassa',
       data: {
         summa: `${checkPromo[0] ? newSum : summa}`,
         orderNumber,
         cadastrNumber
       }
     })
     .then( async ({ data }) => {
       if (data) {
         const fullOrder = {
           date,
           email,
           orderNumber,
           cadastrNumber,
           kindOfRaports: kindOfRaports,
           summa: `${checkPromo[0] ? newSum : summa}`,
           sale: `${checkPromo[0] ? true : false}`,
           paymentId: data.id
         }


         await axios({
           method: 'POST',
           url: '/api/addOrder',
           data: fullOrder
         })

         const yookassPaymentUrl = data?.confirmation?.confirmation_url
         router.push(yookassPaymentUrl)
       }
     })
   }

  // Резервный метод оплаты через другой магазин

  // async function orderGeneration (orderNumber, kindOfRaports, email, cadastrNumber, summa, date) {
  //   const fullOrder = {
  //     date,
  //     email,
  //     orderNumber,
  //     cadastrNumber,
  //     kindOfRaports: kindOfRaports,
  //     summa: `${checkPromo[0] ? newSum : summa}`,
  //     sale: `${checkPromo[0] ? true : false}`,
  //     paymentId: data.id
  //   }


  //   await axios({
  //     method: 'POST',
  //     url: '/api/addOrder',
  //     data: fullOrder
  //   })

  //   setModalActive(true)

  //   await axios({
  //     method: 'POST',
  //     url: '/api/reserveMetod',
  //     data: fullOrder
  //   })
  //  }

   useEffect(() => {
     const ms = Date.now()
     setOrderNumber(ms)

   }, [])

  //  const focus = () => {
  //    ref?.current?.scrollIntoView({behavior: 'smooth'})
  //  }

  //  useEffect(() => {
  //    setTimeout(() => {
  //      focus()
  //    }, 50)
  //  }, [check])

   const data = new Date()
   const year = data.getFullYear()
   const month = `0${data.getMonth()+1}`
   const monthReal = month.length > 2 ? month.slice(1) : month
   const day = data.getDate()
   const hour = data.getHours()
   const minutes = data.getMinutes()
   const date = `${day}.${monthReal}.${year} ${hour}:${minutes}`



   const daynow = data.getDate()
   const orderCreate = orderNumber.toString().split('').slice(7).join('')
   const order = `${daynow}${orderCreate}`

  const outputObject = () => {
    return addedRaports.map((it, index) => {
      return (
        <div className={style["oform-recip-service"]} key={index}>
          <div className={style["oform-recip-service-t"]}>{it}</div>
          <div className={style["oform-recip-service-p"]}>{arrayOfprice[index]}</div>
        </div>
      )
    })
  }


  return (
    <div className={!validForm ? `${style["oform-right1"]}` : `${style["oform-right2"]}`}>
      {/* <PromoCode setPromoCode={setPromoCode} cadNumber={cadNumber} promoCode={promoCode} setActivate={setActivate} activate={activate} isVisible={isVisible} /> */}
      {modalActive && <ModalPaymentsWindow active={modalActive} setActive={setModalActive} />}
    <div className={style["oform-recip2"]}>
    <div className={style["oform-recip-title"]}><span>{`${day}.${monthReal}.${year}`}</span>{order}</div>
    <div className={style["oform-recip-cad"]}>Объект: {cadNumber}</div>
      {checkPromo[0] ? <div className={style["oform-header1"]}>Скидка: 20%</div> : <div className={style["oform-recip-sale"]}>Скидка: не применялась</div>}
      <div className={style["oform-recip-services"]}>
        <div id="oform-recip-services">
          {outputObject()}
        </div>
        {addedRaports.length !==0 && <div className={`${style["oform-recip-service"]} ${style["oform-recip-service--itogo"]}`}>
          <div className={style["oform-recip-service-p"]}><span>{checkPromo[0] ? newSum : summa}  р.</span>{activate && <span className={style.rub2}><del>{summa} р.</del></span>}</div>
          {activate ? <div className={style["oform-recip-service-t1"]}>Сумма с учетом скидки:</div> : <div className={style["oform-recip-service-t1"]}>Сумма:</div>}
        </div>}
      </div>
      <div className={style["oform-recip-line1"]}></div>
      {activate ? <div className={style.dataText}>Промокод: {sendActivePromoCode}</div> : <div className={style.dataText1}>Промокод: не активирован</div>}
      <div className={style.dataText}>Статус заявки: формирование</div>
      {activate && <div className={style.dataRisk}>Риски: отсутствуют</div>}
      <div className={style["oform-recip-line1"]}></div>
      {addedRaports.length !==0 &&
        // loading1 ? (
        //   <div className="pulseLoader6">
        //     <ClipLoader color="#8a95a2" size={15} />
        //   </div>
        // ) : (<div className="oform-recip-footertext">ЗАЯВКА {order}<span>cadmap.su</span></div>)
        <div className={style["oform-recip-footertext"]}>ЗАЯВКА {order}<span>cadmap.su</span></div>
      }
    </div>
    {/* {!activate ? <div className="showPromocode">Промокод не активирован</div> : <><div className="showPromocodeTrue">Промокод: <span>{promoCode}</span><br /></div><div className="recource1">{'(применится автоматически)'}</div></>} */}


      <div className={style.oform}>
        <div className={style["oform-left"]}>
        {!validForm ? <div className={style["oform-header"]} >Введите почтовый ящик:</div> : <div className={style["oform-header1"]}>Почта указана</div>}
          <div className={style["oform-group"]}>
            <input id={validForm ? "validMail":"mail"} className={`${style["oform-input"]}`} onChange={(e) => mailHandler(e)} value={mail} onBlur={(e) => blurHandler(e)} name="mail" placeholder="ivanov@mail.ru"/>
            {(mailDirty && mailError) && <div style={{ color: 'red', marginLeft: '8px', fontSize: '14px' }}>{mailError}</div> }
            {(raportCheckAlarm && check.length === 0 && mailDirty) && <div style={{ color: 'red', marginLeft: '8px', fontSize: '14px' }}>{raportCheckAlarm}</div> }
            <div className={style["oform-input-label--email"]}></div>
          </div>
          {/* {checkPromo[0] ?
            <div className="oform-header">Введите промокод:</div>
            :
            // <div className="oform-header">Введите промокод: {promoCode}</div>

          } */}
          {activate &&
            <>
              {checkPromo[0] ? <div className={style["oform-header1"]}>Промокод активирован</div> : <div className={style["oform-header"]}>Введите промокод: {promoCode}</div>}
              <div className="oform-group">
                <input id={activate ? "truePromo":"promo"} className={`${style["oform-input"]}`} type="text" maxlength="6" onChange={(e) => promoHandler(e)} value={promo} onBlur={(e) => blurHandler1(e)} name="promo" placeholder="HSKLM"/>
                {activate && <div style={{ color: 'red', marginLeft: '8px', fontSize: '14px' }}>{checkPromo[1]}</div> }
                <div className={style["oform-input-label--promo"]}></div>
              </div>
            </>
          }
          <label class={style["oform-checkbox"]}>
            <input id="oform-checkbox--agree" defaultChecked={true} className={style["oform-checkbox--input"]} type="checkbox" onChange={handleChange}/>
              <div className={style["oform-checkbox--text"]}>Я согласен с <a target="_blank" href="/agreement">пользовательским соглашением</a>
              </div>
          </label>
          <div className={style["oform-btns"]}>
            <div
              type="button"
              className={validForm ? `${style.sumButton1}` : `${style.sum__btn} ${style.disable}`}
              onClick={handleClick}
            >
              {loading ? (
                <div className={style.pulseLoader3}>
                  <PulseLoader color="#AFB6BE" size={10} />
                </div>
              ) : !validForm ? (`Оплатить заказ`) : (`Оплатить заказ ${checkPromo[0] ? newSum : summa} руб.`)}
            </div>
          </div>
        </div>
      </div>

    {/* <div className={style.stepdescr1}>
      <div className={style.pdfile1}>
        <strong>Удобно.</strong>
        <span className={style.after_long}>Вы получите отчет в удобном человекочитаемом формате PDF, который можно сразу распечатать</span>
      </div>
      <div className={style.savers1}>
        <strong>Безопасно.</strong>
        <span className={style.after_long}>Если по каким-то причинам невозможно предоставить документ, гарантируем 100% возврат денежных средств</span>
      </div>
      <div className={style.qualify1}>
        <strong>Выгодно.</strong>
        <span className={style.after_long}>Потратив несущественную сумму на отчет, вы обезопасите себя от поспешных сделок, сэкономите время и деньги</span>
      </div>
     </div> */}
    <div className={style["oform-pay-icons"]}></div>

    {/* <div className={style.tgContainer}>
      <div className={style.tgInfo}>телеграм бот:</div>
      <a className={style.tgLink1} href="https://t.me/goskadastrBot">
        <div className={style["footer__top-contactsTd"]}>
          <div className={`${style["footer__top-contacts-data"]} ${style.ob}`}>
            <div className={`${style["footer__top-contacts-soc"]} ${style._tg}`}></div>
          </div>
        </div>
      </a>
    </div> */}
  </div>
  )
}

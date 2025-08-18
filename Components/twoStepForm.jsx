import React, { useState, useEffect, useRef } from 'react'
import PulseLoader from "react-spinners/PulseLoader";
import axios from 'axios'
import { Link } from 'react-scroll'
const md5 = require('md5')


export const TwoStepForm = ({setBackToStep, addedRaports, cadNumber, summa, arrayOfprice, setChek, setSum, reestrMkd, reestr, address, check, setPaintCheck, promoCode, sendActivePromoCode}) => {
  const [orderComplete, setOrderComplete] = useState(false)
  const [privacy, setPrivacy] = useState(true)
  const [newSum, setNewSum] = useState(true)
  const [mail, setMail] = useState('')
  const [promo, setPromo] = useState('')
  const [checkPromo, setCheckPromo] = useState(false)
  const [mailDirty, setMailDirty] = useState(false)
  const [promoDirty, setPromoDirty] = useState(false)
  const [mailError, setMailError] = useState('Введите почтовый ящик')
  const [validForm, setValidForm] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

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
    if (mailError || !privacy) {
      setValidForm(false)
    } else {
      setValidForm(true)
    }
  }, [mailError, privacy])

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
    } else {
      setCheckPromo([false,'Введен неверный промокод, скидка не применилась'])
      setNewSum([summa])
    }
  }

  const autoPromoHandler = (object) => {
    setPromo(object)
    if(object === promoCode) {
      setCheckPromo([true, ''])
      const persent = '20%';
      setNewSum([summa - (summa / 100 * parseFloat(persent))])
    } else {
      setCheckPromo([false,'Введен неверный промокод, скидка не применилась'])
      setNewSum([summa])
    }
  }

  // const paramInfo = {
  //   'Отчет об основных характеристках': addedRaports?.general || null,
  //   'Отчет о переходе прав': addedRaports?.owners || null,
  //   'Справка о кадастровой стоимости': addedRaports?.price || null,
  //   'Комплексная проверка': addedRaports?.complex || null,
  // }


  const outputObject = () => {
    return addedRaports.map((it, index) => {
      return (
        <div className="oform-recip-service" key={index}>
          <div className="oform-recip-service-t">{it}</div>
          <div className="oform-recip-service-p">{arrayOfprice[index]}</div>
        </div>
      )
    })
  }

  async function orderGeneration (orderNumber, kindOfRaports, email, cadastrNumber, summa, date) {
    const fullOrder = {
      date,
      email,
      orderNumber,
      cadastrNumber,
      kindOfRaports: kindOfRaports,
      summa: `${checkPromo[0] ? newSum : summa}`,
      sale: `${checkPromo[0] ? true : false}`
    }

   await axios({
      method: 'POST',
      url: '/api/addOrder',
      data: fullOrder
    })
    .then(({ data }) => {
      if (data) {
        setOrderComplete(true)
      }
    })
  }

  useEffect(() => {
    const ms = Date.now()
    setOrderNumber(ms)

  }, [])

  const focus = () => {
    ref?.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    setTimeout(() => {
      focus()
    }, 50)
  }, [check])

  const data = new Date()
  const year = data.getFullYear()
  const month = `0${data.getMonth()+1}`
  const monthReal = month.length > 2 ? month.slice(1) : month
  const day = data.getDate()
  const hour = data.getHours()
  const minutes = data.getMinutes()
  const date = `${day}.${monthReal}.${year} ${hour}:${minutes}`


  const merchantLogin = 'goscadastr'
  const daynow = data.getDate()
  const orderCreate = orderNumber.toString().split('').slice(7).join('')
  const order = `${daynow}${orderCreate}`
  // const signatureValue = CryptoJS.AES.encrypt(JSON.stringify(`${merchantLogin}:${summa}::test1234`), 'secret key=KaC7RJTWvm3iYV3d6rPpn2DWrC2SjZHQ5Lx6bhYx').toString()

  // const signatureValue = CryptoJS.MD5(`${merchantLogin}:${summa}:${order}:test1234`).toString()
  const signatureValue = md5(`${merchantLogin}:${checkPromo[0] ? newSum : summa}:${order}:jkhfg8d1983`)

  return (
    <>
    <div className="oform-header" ref={ref}>Введите почтовый ящик для получения заказа:</div>
      <div className="oform">
        <div className="oform-left">
          <div id="oform-wrap--email" className="oform-group">
            <input id={validForm ? "validMail":"mail"} className="oform-input suggestions-input" onChange={(e) => mailHandler(e)} value={mail} onBlur={(e) => blurHandler(e)} name="mail"/>
            {(mailDirty && mailError) && <div style={{ color: 'red', marginLeft: '8px', fontSize: '14px' }}>{mailError}</div> }
            <div className="oform-input-label--email"></div>
          </div>
          {checkPromo[0] ?
            <div className="oform-header">Ваш промокод:</div>
            :
            <div className="oform-header">Введите промокод: {sendActivePromoCode}</div>
          //  !sendActivePromoCode ?  <div className="oform-header">Введите промокод: <Link to="upTo" smooth="true" spy={true} duration={500} className="upToPromo"><span>{'получить'}</span></Link></div>
          //  :  <div className="oform-header">Введите промокод: {sendActivePromoCode}</div>
          }
          <div id="oform-wrap--promo" className="oform-group">
            <input id={checkPromo[0] ? "truePromo":"promo"} className="oform-input suggestions-input" type="text" maxlength="6" onChange={(e) => promoHandler(e)} value={promo} onBlur={(e) => blurHandler1(e)} name="promo" />
            {(promoDirty && checkPromo[1]) && <div style={{ color: 'red', marginLeft: '8px', fontSize: '14px' }}>{checkPromo[1]}</div> }
            <div className="oform-input-label--promo"></div>
          </div>
          <label class="oform-checkbox">
            <input id="oform-checkbox--agree" defaultChecked={true} class="oform-checkbox--input" type="checkbox" onChange={handleChange}/>
              <div class="oform-checkbox--text">Я согласен с <a target="_blank" href="/privacy-policy">политикой конфиденциальности</a> и <a target="_blank" href="/agreement">пользовательским соглашением</a>
              </div>
          </label>
          <div className="oform-btns">
            <div className="sumButton" onClick={() => {
              setBackToStep(false)
              setChek([])
              setSum([])
              setPaintCheck({})
            }}>Вернуться назад</div>
            <div className="oform-btns--right">
              {!orderComplete ? (
                <div
                  type="button"
                  className={validForm ? "sumButton" : "sum__btn ob"}
                  disabled={!validForm}
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => {
                      orderGeneration(order, addedRaports, mail, cadNumber, summa, date)
                    }, 1000)
                  }}
                >
                  {loading ? (
                    <div className="pulseLoader3">
                      <PulseLoader color="#AFB6BE" size={10} />
                    </div>
                  ) : ('Сформировать заявку')}
              </div>
              ) : (
              <div
                type="button"
                className={validForm ? "payButton" : "sum__btn ob"}
                disabled={!validForm}
                >
                <a href={`https://auth.robokassa.ru/Merchant/Index.aspx?MerchantLogin=${merchantLogin}&OutSum=${checkPromo[0] ? newSum : summa}&InvoiceID=${order}&Description=${order}&SignatureValue=${signatureValue}`}>
                  Оплатить заказ - <span className="oform-btns--cost">{checkPromo[0] ? newSum : summa}р</span>
                </a>
              </div>
              )}
            </div>
          </div>
          <div className="table-cell after_first">
            <div className="stepdescr">
              <div className="pdfile">
                <strong>Удобно.</strong>
                <span className="after_long">Вы получите отчет в удобном человекочитаемом формате PDF, который можно сразу распечатать</span>
              </div>
              <div className="savers">
                <strong>Безопасно.</strong>
                <span className="after_long">Если по каким-то причинам невозможно предоставить документ, гарантируем 100% возврат денежных средств</span>
              </div>
              <div className="qualify">
                <strong>Выгодно.</strong>
                <span className="after_long">Потратив нсущественную сумму на отчет, вы обезопасите себя от поспешных сделок, сэкономите время и деньги</span>
              </div>
            </div>
          </div>
        </div>
        <div className="oform-right">
          <div className="oform-recip">
            <div className="oform-recip-title"><span>{`${day}.${monthReal}.${year}`}</span>{orderComplete && order}</div>
            {!reestrMkd ? <div className="oform-recip-cad">Кадастровый номер: {cadNumber}</div> : <div className="oform-recip-cad">{reestr}</div>}
            {checkPromo[0] ? <div className="oform-recip-cad">Скидка: 20%</div> : <div className="oform-recip-cad">Скидка: не применялась</div>}
            <div className="oform-recip-services">
              <div id="oform-recip-services">
                {outputObject()}
              </div>
              <div className="oform-recip-service oform-recip-service--itogo">
                <div className="oform-recip-service-p"><span id="oform-recip-service--itogo">{checkPromo[0] ? newSum : summa}</span> р.</div>
                <div className="oform-recip-service-t">{checkPromo[0] ? 'Сумма заказа с учетом скидки' : 'Сумма заказа'}:</div>
              </div>
            </div>
            {!orderComplete ? <div className="oform-recip-line"></div> : <div className="oform-recip-line1"></div>}
            {orderComplete && <div className="dataText">Статус: одобрено</div>}
            {orderComplete && <div className="dataText">Данные: проверены</div>}
            {orderComplete && <div className="dataRisk">Риски: отсутствуют</div>}
            {orderComplete && <div className="oform-recip-footertext">ЗАЯВКА {order}<span>cadmap.su</span></div>}
            <div className="oform-recip-footer"></div>
          </div>
          <div className="oform-pay-icons"></div>
          <div className="security">
            {/* <div className="pay-icons"></div> */}
            <div className="payCode"></div>
          </div>
          <div class="countOfreport">Отчетов за сегодня: <b> 741</b></div>
        </div>
      </div>
    </>
  )
}

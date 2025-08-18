import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { ModalWindow } from './modalWindow'
import { TwoStepFormToYooKassa } from './twoStepFormToYooKassa'
import { ShortDataReport } from './shortDataReport'
import { EgrulDataReport } from './egrulDataReport';
import style from '../styles/File.module.css'

const CheckEgrul = ({cadNum, owner, rightsCheck, promoCode, sendActivePromoCode, activate, setTwoStepChecker, stepTwoChecker, setPromoCode, setActivate, rightLoader, setIsVisible, isVisible , onCkickCadastrNumber}) => {
  const [checkedState, setCheckedState] = useState({
    egrul: true,
    contragent: true,
    mainReport: false,
    ownerReport: false,
  });

  const [check, setChek] = useState([ "Выписка из ЕГРЮЛ", "Отчет о проверке контрагента"])
  const [sum, setSum] = useState([ "250", "650" ])
  const [paintCheck, setPaintCheck] = useState({ egrul: "Выписка из ЕГРЮЛ", contragent: "Отчет о проверке контрагента" })
  const [modalActive, setModalActive] = useState(false)
  const [raport, setRaport] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [twoStep, setTwoStep] = useState(false)
  const [counter, setCounter] = useState('')
  const [loading, setLoading] = useState(false)
  const {ruleReport, mainReportWithOwner, cadPriceReport, mainReport, ownerReport, complexReport, express, egrul, contragent} = paintCheck


  function handleChange (event) {
    let {name, checked, id} = event.target
     const price = event.target.attributes.price.nodeValue
    if (checked) {
      setSum([...sum, price])
      setChek([...check, name])
      setPaintCheck({...paintCheck, [id]:name})
      setCheckedState({...checkedState, [id]:true})
    } else {
      setChek([...check.filter(it => it!==name)])
      setSum([...sum.filter(it => it!==price)])
      setCheckedState({...checkedState, [id]:false})
      delete paintCheck[id];
      setPaintCheck(paintCheck)
    }
  }


 const arrayOfPrice = sum.map(it => parseInt(it))
 let summa = arrayOfPrice.reduce((acc, rec) => {
  return acc + rec
 }, 0)

 useEffect(() => {
  if (summa === 0) {
    setValidForm(false)
  } else {
    setValidForm(true)
  }
}, [summa])

// useEffect(() => {
//   window.scrollTo(0, 0);
// }, []);

useEffect(() => {
  setLoading(!loading)
}, [rightLoader]);


const askCounter = async () => {
  const checkCounter = await axios('/api/counter')
  setCounter(checkCounter?.data)
}

useEffect(() => {
  askCounter()
}, [])


  return (
    <div data-content="kadastr" id="egrn" className={style.object__block}>
        <div className={style.objectContainer}>
          <div className={style["object__block-wrap1"]}>
            <div className={style.checkRaportsTitle}><h2>Отметьте необходимые документы:</h2></div>
              <div name="egrul" className={egrul ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                    <div className={`${style.order__caption2}`}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Выписка из ЕГРЮЛ" price="250" className={style["checkbox-list"]}  onChange={handleChange} id="egrul" checked={checkedState.egrul} />
                      </div>
                      Выписка из ЕГРЮЛ<span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- 20%</span>}
                    </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Обязательный отчет</div>
                      {/* {!activate ? isVisible && <div className={style.mustSale}>Доступна скидка - 20%</div> : <div className={style.mustSaleActive}>Cкидка - 20%</div>} */}
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.globalReport}`} onClick={() => {setModalActive(true), setRaport('egrul')}}></div>
                    <div className={style.orderContainer}>
                     <div className={style.order__term}>Официальная выписка из ЕГРЮЛ налоговой. Содержит информацию о конкретном юридическом лице или ИП из единого государственного реестра Федеральной налоговой службы. Заверена ЭЦП. Имеет статус документа.</div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                        <div className={style.specification1}>
                          <p>Сроки: моментально | Формат PDF</p>
                        </div>
                        <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('egrul')}}>Подробнее</div>
                        {!activate ? <div className={style.order__price}>250 р.</div> : <div className={style.order__priceIsActive}>{250 - (250 / 100 * parseFloat(20))} р.</div>}
                          {activate && <span className={style.rub2}><del>250 р</del></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div name="contragent" className={contragent ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                    <div className={`${style.order__caption2}`}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Отчет о проверке контрагента" price="650" className={style["checkbox-list"]}  onChange={handleChange} id="contragent" checked={checkedState.contragent} />
                      </div>
                      Отчет о проверке контрагента <span className={style.recource}>не менее 7 официальных источников</span>{activate && <span className={style.discountVolume}>- 20%</span>}
                    </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Обязательный отчет</div>
                      {/* {!activate ? isVisible && <div className={style.mustSale}>Доступна скидка - 20%</div> : <div className={style.mustSaleActive}>Cкидка - 20%</div>} */}
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.globalReport}`} onClick={() => {setModalActive(true), setRaport('contragent')}}></div>
                    <div className={style.orderContainer}>
                     <div className={style.order__term}>Отчет о проверке юридических лиц и ИП на благонадёжность содержит результат обработки данных из официальных открытых источников. Количество источников может меняться в зависимости от типа юридического лица, а так же объема доступной информации.</div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                        <div className={style.specification1}>
                          <p>Сроки: 1-7 дней | Формат PDF</p>
                        </div>
                        <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('contragent')}}>Подробнее</div>
                        {!activate ? <div className={style.order__price}>650 р.</div> : <div className={style.order__priceIsActive}>{650 - (650 / 100 * parseFloat(20))} р.</div>}
                          {activate && <span className={style.rub2}><del>650 р</del></span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ModalWindow active={modalActive} setActive={setModalActive} raport={raport}/>
              <div className={style.security}>
                <div className={style.payCode}></div>
              </div>
              <div class={style.countOfreport}>Отчетов за сегодня: <b>{counter}</b></div>
              <div className={style.block1__item}>
                <div className={style.block1__decree}>
                <p>Сервис проверки юридических лиц и ИП на благонадёжность — информация, которая содержится в отчёте, является результатом обработки данных из официальных открытых источников. Неполные или некорректные сведения являются единичными случаями. Рекомендации, которые содержатся в отчёте, не являются достаточным основанием для принятия решений или формирования окончательных выводов. Информацию следует рассматривать в совокупности обстоятельств и факторов.</p>
                </div>
              </div>
            </div>
            <EgrulDataReport check={check} setBackToStep={setTwoStep} addedRaports={check} cadNumber={cadNum || onCkickCadastrNumber} summa={summa} arrayOfprice={sum} setChek={setChek} setSum={setSum} setPaintCheck={setPaintCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} validForm={validForm} setTwoStep={setTwoStep} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} isVisible={isVisible}/>
        </div>
    </div>
  )
}

export default CheckEgrul
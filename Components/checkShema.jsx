import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { ModalWindow } from './modalWindow'
import { ShortDataReport } from './shortDataReport'
import style from '../styles/File.module.css'

const CheckShema = ({cadNum, owner, rightsCheck, promoCode, sendActivePromoCode, activate, setTwoStepChecker, stepTwoChecker, setPromoCode, setActivate, rightLoader, setIsVisible, isVisible , onCkickCadastrNumber, polygonCoordinates }) => {
 const [checkedState, setCheckedState] = useState({
    shemaReport: true,
  });

  const [check, setChek] = useState(["Схема образования участка"])
  const [sum, setSum] = useState([ "5000" ])
  const [paintCheck, setPaintCheck] = useState({ shemaReport: "Схема образования участка"})
  const [modalActive, setModalActive] = useState(false)
  const [raport, setRaport] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [twoStep, setTwoStep] = useState(false)
  const [counter, setCounter] = useState('')
  const [loading, setLoading] = useState(false)
  const { shemaReport } = paintCheck


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

  const handleSelect = (id, name, price) => {
    // Симуляция нажатия на чекбокс
    const isChecked = !checkedState[id]; // Переключить состояние
    const fakeEvent = {
      target: {
        name,
        checked: isChecked,
        id,
        attributes: {
          price: { nodeValue: price },
        },
      },
    };
    handleChange(fakeEvent);
  };


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

const persent = '20%';


  return (
    <div data-content="kadastr" id="egrn" className={style.object__block}>
        <div className={style.objectContainer}>
          <div className={style["object__block-wrap1"]}>
            <div className={style.checkRaportsTitle}><h2>Отметьте необходимые документы:</h2></div>
              <div name="shemaReport" className={shemaReport ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                    <div className={style.order__caption2}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Схема образования участка" price="5000" className={style["checkbox-list"]}  onChange={handleChange} id="shemaReport" checked={checkedState.shemaReport}/>
                      </div>
                      Схема образования участка <span className={style.recource}>формируется специалистом</span>{activate && <span className={style.discountVolume}>- {persent}</span>}
                      </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Обязательный документ
                      <span className={style.sales}>Требуется для старта процедуры формирования участка</span>
                      </div>
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.shema}`} onClick={() => {setModalActive(true), setRaport('shemaReport')}}></div>
                    <div className={style.orderContainer}>
                      <div className={style.order__term}>Схема расположения земельного участка - документ, необходимый для того, чтобы начать процедуру предоставления желаемого земельного участка в собственность или в аренду. Схема описывает тот участок, который Вы хотите получить, если у него нет кадастрового номера или номера по проекту межевания.</div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                         <div className={style.specification1}>
                            <p>Сроки: 1-10 дней | Формат PDF</p>
                         </div>
                        <div className={style.orderDescription}>
                          <div data-id="33" className={style.order__description} onClick={() => {setModalActive(true), setRaport('shemaReport')}}>Подробнее</div>
                          {!activate ? <div className={style.order__price}>5000 р.</div> : <div className={style.order__priceIsActive}>{5000 - (5000 / 100 * parseFloat(persent))} р.</div>}
                        </div>
                        {/* {activate && <span className={style.rub2}><del>5000 р</del></span>} */}
                        {shemaReport ? <div className='btnHistory3' onClick={() => handleSelect("shemaReport", "Схема образования участка", "5000")}>Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("shemaReport", "Схема образования участка", "5000")}>Выбрать</div>}
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
                  <p>Схемы изготовляются в соответствии с Приказом Росреестра от 19.04.2022 № П/0148
                    "Об утверждении требований к подготовке СРЗУ на КПТ и формату СРЗУ на КПТ
                    в форме электронного документа.</p>
                </div>
              </div>
            </div>
            <ShortDataReport check={check} setBackToStep={setTwoStep} addedRaports={check} cadNumber={cadNum || onCkickCadastrNumber} summa={summa} arrayOfprice={sum} setChek={setChek} setSum={setSum} setPaintCheck={setPaintCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} validForm={validForm} setTwoStep={setTwoStep} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} isVisible={isVisible} polygonCoordinates={polygonCoordinates} />
        </div>
    </div>
  )
}

export default CheckShema
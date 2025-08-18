import React, { useState, useEffect } from 'react'
import { ModalWindow } from './modalWindow'
import { TwoStepForm } from './twoStepForm'

const FlatReestr = ({ flats, number, mkd }) => {
  const mkdObject = mkd && JSON.parse(mkd)
  const address = mkdObject?.address
  const houseNumber = (number + '||').toUpperCase()
  const [check, setChek] = useState(false)
  const [sum, setSum] = useState(0)
  const [modalActive, setModalActive] = useState(false)
  const [raport, setRaport] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [twoStep, setTwoStep] = useState(false)
  const [paintCheck, setPaintCheck] = useState({})


  const {flatReestr} = paintCheck

  function handleChange (event) {
    const {checked, id, name} = event.target
    const price = event.target.attributes.price.nodeValue
    if (checked) {
      setSum(price)
      setChek(true)
      setPaintCheck({...paintCheck, [id]:name})
    } else {
      setChek(false)
      setSum(0)
      delete paintCheck[id];
      setPaintCheck(paintCheck)
    }
  }


 useEffect(() => {
  if (sum === 0) {
    setValidForm(false)
  } else {
    setValidForm(true)
  }
}, [sum])


  return (
    <div data-content="kadastr" id="egrn" className="object__block">
      {!twoStep ? (
              <div className="object__block-wrap">
              <div className="object__block-title _kadastr"><h2>Оформление заказа:</h2></div>
              <div className="flatTableHead">
                <div className="cadCost">Обращаем ваше внимание. Сведения о количестве квартир берутся из открытых источников и могут отличаться от действительности. Кроме этого в реестре могут
                содержаться дубли, имеющие одинаковый адрес, но разные кадастровые номера.<br /><br />
                Объектов найдено: {flats} шт.
                </div>
              </div>
              <div className={flatReestr ? 'order__item_checked':'order__item'}>
                <div className="order__left">
                  <div className="order__checkbox">
                    <input type="checkbox" name="реест собственников МКД" price={`${flats * 50}`} className="checkbox-list" onChange={handleChange} id="flatReestr"/>
                  </div>
                    <div className="order__info">
                      <div className="order__caption">Реестр помещений МКД</div>
                      <div className="order__text">
                        <div className="order__term">Реестр квартир с информацией о каждой квартире. Реестр содержит данные о: количестве собственников, наличие обременений, наличии или отсутствия прав.</div>
                        <div className="order__right">
                        <div data-id="33" className="order__description" onClick={() => {setModalActive(true), setRaport('reestrOfFlats')}}>Подробнее</div>
                          <div className="order__price">
                            <div>{flats * 50}</div> р.
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <ModalWindow active={modalActive} setActive={setModalActive} raport={raport}/>
              <div className="order__sum ">
                <div className="sum">
                  <div className="sum__text"> Сумма к оплате: <span className="sum__cost">{flats * 50}</span> руб.</div>
                  <div className={validForm ? "sum__btn" : "sum__btn ob"} disabled={!validForm} onClick={() => {setTwoStep(true)}}> Оформить заказ</div>

                </div>
              </div>
              <div className="block1__item">
                <div className="block1__decree">
                  <div>Оформление заявки на получение реестра квартир многоквартирного дома. ФИО собственников жилья является персональными данными и не указаны в реестре, согласно Федеральному закону от 13.07.2015 N 218-ФЗ «О государственной регистрации недвижимости»
                  </div>
                </div>
              </div>
            </div>
      ) : <TwoStepForm check={check} setBackToStep={setTwoStep} addedRaports={[]} reestr={'Реестр многоквартирного дома'} summa={sum} arrayOfprice={sum} setChek={setChek} setSum={setSum} reestrMkd={true} address={address} setPaintCheck={setPaintCheck}/>}
    </div>
  )
}

export default FlatReestr

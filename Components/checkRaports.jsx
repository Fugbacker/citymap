import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ClipLoader from "react-spinners/ClipLoader";
import { ModalWindow } from './modalWindow'
import { ShortDataReport } from './shortDataReport'
import style from '../styles/File.module.css'

const CheckRaports = ({cadNum, owner, rightsCheck, promoCode, sendActivePromoCode, activate, setTwoStepChecker, stepTwoChecker, setPromoCode, setActivate, rightLoader, setIsVisible, isVisible , onCkickCadastrNumber, checkLand}) => {
  const [checkedState, setCheckedState] = useState({
    express: true,
    cadPriceReport: true,
    mainReport: false,
    ownerReport: false,
    landRaport: true,
  });


  const [check, setChek] = useState(() => {
    const items = ["Экспресс отчет", "Справка о кадастровой стоимости"];
    if (checkLand) items.push("Сводный земельный отчет");
    return items;
  });
  const [sum, setSum] = useState(() => {
    const prices = ["500", "550"];
    if (checkLand) prices.push("900");
    return prices;
  });
  const [paintCheck, setPaintCheck] = useState(() => {
    const obj = {
      express: "Экспресс отчет",
      cadPriceReport: "Справка о кадастровой стоимости",
    };
    if (checkLand) obj.landRaport = "Сводный земельный отчет";
    return obj;
  });
  const [modalActive, setModalActive] = useState(false)
  const [raport, setRaport] = useState('')
  const [validForm, setValidForm] = useState(false)
  const [twoStep, setTwoStep] = useState(false)
  const [counter, setCounter] = useState('')
  const [loading, setLoading] = useState(false)
  const {ruleReport, mainReportWithOwner, cadPriceReport, mainReport, ownerReport, complexReport, express, landRaport} = paintCheck


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

const persent = '20%';
// const salePercent = 30


  return (
    <div data-content="kadastr" id="egrn" className={style.object__block}>
        <div className={style.objectContainer}>
          <div className={style["object__block-wrap1"]}>
            <div className={style.checkRaportsTitle}><h2>Отметьте необходимые документы:</h2></div>
              {checkLand && <div name="landRaport" className={landRaport ? `${style.order__item_checked}` : `${style.order__item}`}>
                <div className={style.order__left}>
                <div style={{ position: 'relative'}}>
                  {/* Значок "NEW" */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '-13px',
                      right: '-16px',
                      background: 'red',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                      zIndex: 2
                    }}
                  >
                    !
                  </span>
                </div>
                  <div className={style.order__info}>
                  <div className={style.order__caption2}>
                    <div className={style.order__checkbox1}>
                      <input type="checkbox" name="Сводный технический план" price="900" className={style["checkbox-list"]}  onChange={handleChange} id="landRaport" checked={checkedState.landRaport}/>
                    </div>
                    Сводный земельный отчет <span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}</div>

                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Важный отчет
                        <span className={style.sales}>Содержит информацию о пересечениях</span>
                      </div>
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.landRaport}`} onClick={() => {setModalActive(true), setRaport('landRaport')}}></div>
                    <div className={style.orderContainer}>
                      <div className={style.order__term}>
                      <ul>
                        <li>Технические сведения участка;</li>
                        <li>Обременения, ограничения (при их наличии);</li>
                        <li>Пересечение с ЗОУИТ (при их наличии);</li>
                        <li>Пересечение с другими участками (при их наличии);</li>
                      </ul>
                      </div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                          <div className={style.specification1}>
                            <p>Сроки: 10 минут | Формат PDF</p>
                          </div>
                          <div className={style.orderDescription}>
                            <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('landRaport')}}>Подробнее</div>
                            {!activate ? <div className={style.order__price}>900 р.</div> : <div className={style.order__priceIsActive}>{900 - (900 / 100 * parseFloat(persent))} р.</div>}
                          </div>
                          {landRaport ? <div className='btnHistory3' onClick={() => handleSelect("landRaport", "Сводный земельный отчет", "900")}
                            >Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("landRaport", "Сводный земельный отчет", "900")}>Выбрать</div>}
                        </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>}
              <div name="express" className={express ? `${style.order__item_checked}` : `${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                  <div className={style.order__caption2}>
                    <div className={style.order__checkbox1}>
                      <input type="checkbox" name="Экспресс отчет" price="500" className={style["checkbox-list"]}  onChange={handleChange} id="express" checked={checkedState.express}/>
                    </div>
                    Экспресс отчет <span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}</div>

                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Быстро
                        <span className={style.sales}>экспресс проверка</span>
                      </div>
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.expressReport}`} onClick={() => {setModalActive(true), setRaport('express')}}></div>
                    <div className={style.orderContainer}>
                      <div className={style.order__term}>
                      <ul>
                        <li>Фотографии МКД (могут отсутствовать);</li>
                        <li>Технические сведения;</li>
                        <li>Количество собственников (могут отсутствовать);</li>
                        <li>Обременения (при их наличии);</li>
                      </ul>
                      </div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                          <div className={style.specification1}>
                            <p>Сроки: 10 минут | Формат PDF</p>
                          </div>
                          <div className={style.orderDescription}>
                            <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('express')}}>Подробнее</div>
                            {!activate ? <div className={style.order__price}>500 р.</div> : <div className={style.order__priceIsActive}>{500 - (500 / 100 * parseFloat(persent))} р.</div>}
                          </div>
                          {express ? <div className='btnHistory3' onClick={() => handleSelect("express", "Экспресс отчет", "500")}
                            >Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("express", "Экспресс отчет", "500")}>Выбрать</div>}
                        </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div name="cost" className={cadPriceReport ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                    <div className={style.order__caption2}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Справка о кадастровой стоимости" price="550" className={style["checkbox-list"]}  onChange={handleChange} id="cadPriceReport" checked={checkedState.cadPriceReport}/>
                      </div>
                      Справка о кадастровой стоимости <span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}
                      </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Выбор клиентов
                      <span className={style.sales}>Требуется для расчета имущественного налога</span>
                      </div>
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.cadastrCost}`} onClick={() => {setModalActive(true), setRaport('cost')}}></div>
                    <div className={style.orderContainer}>
                      <div className={style.order__term}>Стоимость объекта недвижимости, установленная в процессе государственной кадастровой оценки. В большинстве сдучаев необходима для формирования налоговой базы.</div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                         <div className={style.specification1}>
                            <p>Сроки: 30 минут | Формат PDF</p>
                         </div>
                        <div className={style.orderDescription}>
                          <div data-id="33" className={style.order__description} onClick={() => {setModalActive(true), setRaport('cost')}}>Подробнее</div>
                          {!activate ? <div className={style.order__price}>550 р.</div> : <div className={style.order__priceIsActive}>{550 - (550 / 100 * parseFloat(persent))} р.</div>}
                        </div>
                        {cadPriceReport ? <div className='btnHistory3' onClick={() => handleSelect("cadPriceReport", "Справка о кадастровой стоимости", "550")}>Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("cadPriceReport", "Справка о кадастровой стоимости", "550")}>Выбрать</div>}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              <div name="general" className={mainReport ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                  <div className={style.order__info}>
                    <div className={`${style.order__caption2}`}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Отчет об основных характеристиках" price="750" className={style["checkbox-list"]}  onChange={handleChange} id="mainReport" checked={checkedState.mainReport} />
                      </div>
                      Отчет об основных характеристиках <span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}
                    </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Обязательный отчет
                        <span className={style.sales}>Требуется для проверки недвижимости</span>
                      </div>
                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.globalReport}`} onClick={() => {setModalActive(true), setRaport('general')}}></div>
                    <div className={style.orderContainer}>
                     <div className={style.order__term}>
                      <ul>
                        <li>Общая техническая информация;</li>
                        <li>Вид собственника (юридическое или физическое лицо);</li>
                        <li>Ограничения, обременения, аресты (при их наличии);</li>
                        <li>Технический план квартиры или кадастровый план участка (при их наличии);</li>
                      </ul>
                    </div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                        <div className={style.specification1}>
                          <p>Сроки: 1-7 дней | Формат PDF</p>
                        </div>
                        <div className={style.orderDescription}>
                          <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('general')}}>Подробнее</div>
                          {!activate ? <div className={style.order__price}>750 р.</div> : <div className={style.order__priceIsActive}>{750 - (750 / 100 * parseFloat(persent))} р.</div>}
                        </div>
                          {mainReport ? <div className='btnHistory3' onClick={() => handleSelect("mainReport", "Отчет об основных характеристиках", "750")}>Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("mainReport", "Отчет об основных характеристиках", "750")}>Выбрать</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div name="generalWithOwner" className={mainReportWithOwner ? `${style.order__item_checked}` : `${style.order__item}`}>
                <div className={style.order__left}>
                <div className={style.order__info}>
                  <div className={`${style.order__caption2}`}>
                  <div className={style.order__checkbox1}>
                    <input type="checkbox" name="Расширенный отчет" price="7500" className={style["checkbox-list"]}  onChange={handleChange} id="mainReportWithOwner" checked={checkedState.mainReportWithOwner} />
                  </div>

                      {'Расширенный отчет'} <span className={style.recource}>1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}
                    </div>
                    <div className={style.mustContainer}>
                      <div className={style.mustText}>Обязательный отчет
                       <span className={style.sales}>Требуется для проверки собственника</span>
                      </div>

                    </div>
                    <div className={style.order__text}>
                    <div className={`${style.example} ${style.globalReport}`} onClick={() => {setModalActive(true), setRaport('generalWithOwner')}}></div>
                    <div className={style.orderContainer}>
                     <div className={style.order__term}>
                      <ul>
                        <li>Общая техническая информация;</li>
                        <li>ФИО собственника;</li>
                        <li>Ограничения, обременения, аресты (при их наличии);</li>
                        <li>Технический план квартиры или кадастровый план участка (при их наличии);</li>
                      </ul>
                    </div>
                      <div class={style["oform-recip-line"]}> </div>
                      <div className={style.order__right}>
                      <div className={style.specification1}>
                        <p>Сроки: 1-7 дней | Формат PDF</p>
                      </div>
                      <div className={style.orderDescription}>
                      <div data-id="33" className={style.order__description}  onClick={() => {setModalActive(true), setRaport('generalWithOwner')}}>Подробнее</div>
                      {!activate ? <div className={style.order__price}>7500 р.</div> : <div className={style.order__priceIsActive}>{7500 - (7500 / 100 * parseFloat(persent))} р.</div>}
                      </div>
                        {mainReportWithOwner ? <div className='btnHistory3' onClick={() => handleSelect("mainReportWithOwner", "Расширенный отчет", "7500")}>Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("mainReportWithOwner", "Расширенный отчет", "7500")}>Выбрать</div>}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <div className={ruleReport ? `${style.order__item_checked}`:`${style.order__item}`}>
                <div className={style.order__left}>
                    <div className={style.order__info}>
                      <div className={style.order__caption2}>
                      <div className={style.order__checkbox1}>
                        <input type="checkbox" name="Отчет о переходе прав" price="800" className={style["checkbox-list"]}  onChange={handleChange} id="ruleReport" checked={checkedState.ruleReport}/>
                      </div>
                        Отчёт о переходе прав <span className="recource">1 официальный источник</span>{activate && <span className={style.discountVolume}>- {persent}</span>}
                      </div>
                      <div className={style.mustContainer}>
                      </div>
                      <div className={style.order__text}>
                      <div className={`${style.example} ${style.ownerReport}`} onClick={() => {setModalActive(true), setRaport('owners')}}></div>
                      <div className={style.orderContainer}>
                        <div className={style.order__term}>
                          <ul>
                            <li>Полная история собственников начиная с 1998 года;</li>
                            <li>Вид собственника (юридическое или физическое лицо);</li>
                            <li>Доля в праве;</li>
                            <li>Дата образвования права</li>
                          </ul>
                        </div>
                        <div class={style["oform-recip-line"]}></div>
                        <div className={style.order__right}>
                          <div className={style.specification1}>
                            <p>Сроки: 1-7 дней | Формат PDF</p>
                          </div>
                          <div className={style.orderDescription}>
                            <div data-id="33" className={style.order__description} onClick={() => {setModalActive(true), setRaport('owners')}}>Подробнее</div>
                            {!activate ? <div className={style.order__price}>800 р.</div> : <div className={style.order__priceIsActive}>{800 - (800 / 100 * parseFloat(persent))} р.</div>}
                          </div>
                          {ruleReport ? <div className='btnHistory3' onClick={() => handleSelect("ruleReport", "Отчет о переходе прав", "800")}>Выбрано</div> : <div className='btnHistory2' onClick={() => handleSelect("ruleReport", "Отчет о переходе прав", "800")}>Выбрать</div>}
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
                  <p>Оформление заявки на получение информации об объектах недвижимости и её последующей проверки по базам на наличие ареста, долгов и обременений доступно по всем объектам, поставленных на учёт. Данный сервис осуществляет услугу проверки недвижимости перед покупкой, на основе <a className={style.linkToMain} href="/" title="Выписка из Единого Государственного Реестра Недвижимости">выписки из егрн.</a></p>
                </div>
              </div>
            </div>
            <ShortDataReport check={check} setBackToStep={setTwoStep} addedRaports={check} cadNumber={cadNum || onCkickCadastrNumber} summa={summa} arrayOfprice={sum} setChek={setChek} setSum={setSum} setPaintCheck={setPaintCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} validForm={validForm} setTwoStep={setTwoStep} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} isVisible={isVisible}/>
        </div>
    </div>
  )
}

export default CheckRaports
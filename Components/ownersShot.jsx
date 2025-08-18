import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners'
import Link from 'next/link'
import style from '../styles/File.module.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const OwnersShot = ({ cadastrObj, areaType, activate, setPromoCode, setActivate, promoCode, setIsVisible, isVisible, rightsData, encumbrancesChecker, encumbrancesData, noRigths}) => {

  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300); // 10 минут в секундах
  const [value, setValue] = useState(false)
  const fromBack = cadastrObj?.isFromBackup
  const rights = cadastrObj?.rightsData?.realty?.rights || cadastrObj?.rightsData?.rights?.realty?.rights || cadastrObj?.rightsData?.rightEncumbranceObjects || rightsData
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1) || cadastrObj?.rightsData?.rightEncumbranceObjects?.length !== 0 || rights.length !== 0

  const rightsCount = cadastrObj?.rightsData?.realty?.rights?.filter((it) => it?.rightState === 1).length || cadastrObj?.rightsData?.rights?.realty?.rights?.filter((it) => it?.rightState === 1).length || cadastrObj?.rightsData?.rightEncumbranceObjects?.length || rightsData?.length
  const encumbrances = cadastrObj?.rightsData?.realty?.encumbrances || cadastrObj?.rightsData?.rights?.realty?.encumbrances || encumbrancesData
  const encumbrancesCheck = encumbrancesChecker || encumbrancesData?.length !== 0 || encumbrances?.filter((it) =>  it?.encmbState === 1)
  // const inputString = rights?.[0]?.regNmbr
  const inputString = rights?.[0]?.rightData?.regNum || rights?.[0]?.encumbrances?.[0]?.regNum || rights?.[0]?.regNmbr || rights?.[0]?.number || rights?.[0]?.rightNumber


  const hideLastSixCharacters = (inputString) => {
    const visibleLength = inputString?.length - 6;
    const visiblePart = inputString?.substring(0, visibleLength);
    const hiddenPart = inputString?.substring(visibleLength)?.replace(/./g, '*');
    return visiblePart + hiddenPart;
  };

  // const outputString = hideLastSixCharacters(inputString);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsVisible(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (cadastrObj?.length !== 0 || (rights && rights?.length !== 0) || noRigths) {
      setValue(true)
    }
  }, [cadastrObj])


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getTextColor = () => {
    return timeLeft <= 60 && 'red';
  };


  const outputObjectSession = () => {
    const paramInfo =  {
      'Обременения:': rights ? <p className={style.restrictionsTrue}>Есть</p> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
      'Аресты:': rights ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
      'Залоги:': rights ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
      'Ипотека:': rights ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
      'Иные ограничения:': rights ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
    }

    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className={style.object__blockTableTr1}>
          <div className={style.object__blockTableTd1}>{it}</div>
          <div className={style.object__blockTableTd1}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  // const outputObjectSession1 = () => {
  //   const paramInfo =  {
  //     'Обременения:': value ? <p className={style.restrictionsNull}>{rights && rightsCheck?.length !== 0 ? 'Отсутствуют' : <div className={style.closedData}><p>данные по запросу</p></div>}</p> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
  //     'Аресты:': value ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
  //     'Залоги:': value ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
  //     'Ипотека:': value ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
  //     'Иные ограничения:': value ? <div className={style.closedData}><p>данные по запросу</p></div> : <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/>,
  //   }
  //   return Object.keys(paramInfo).map((it) => {
  //     return paramInfo[it] && (
  //       <div key={it} className={style.object__blockTableTr1}>
  //         <div className={style.object__blockTableTd1}>{it}</div>
  //         <div className={style.object__blockTableTd1}>{paramInfo[it]}</div>
  //       </div>
  //     )
  //   })
  // }

  const outputObjectSession1 = () => {
    const paramInfo =  {
      'Обременения:': <div className={style.closedData}><p>в отчете</p></div>,
      'Залоги:':  <div className={style.closedData}><p>в отчете</p></div>,
      'Ипотека:': <div className={style.closedData}><p>в отчете</p></div>,
      'Аресты:':  <div className={style.closedData}><p>в отчете</p></div>,
      'Иные ограничения:': <div className={style.closedData}><p>в отчете</p></div>,
    }


    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className={style.object__blockTableTr1}>
          <div className={style.object__blockTableTd1}>{it}</div>
          <div className={style.object__blockTableTd1}>{paramInfo[it]}</div>
        </div>
      )
    })
  }


  const saleId = "Скидка активирована"
  const notifySale = () => {
    toast.success("Скидка 20% активирована. Указанный процент скидки будет автоматически применен при оплате", {
      toastId: saleId,
      autoClose: 7000
    });
  }

  return (
    <>
      <div data-content="main" className={style.object__block3} id="owners-info">
      <div className={style["object__block-wrap"]}>
        <div className={style["object__block-title1"]}>
          <h2>Собственники</h2>
        </div>
        {/* <div className={style["object__block-title-2"]}>
          {`Сведения о собственниках:`}
        </div> */}
        <div className={style.object__blockTable1}>
          <div className={style.object__blockTableTr1}>
            <div className={style.object__blockTableTd1}>Количество:</div>
            {value ? <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'}/> : rights && rights.length !== 0 ? <div className={style.object__blockTableTd1}><p>{rightsCount}</p></div> : <div className={style.closedData}><p>данные по запросу</p></div> }
            {/* <div className={style.closedData}>{rights ? <p>{rightsCount}</p> || <p>данные по запросу</p> : <Skeleton />}</div> */}
          </div>
          <div className={style.object__blockTableTr1}>
            <div className={style.object__blockTableTd1}>Номер права:</div>
            {value ? <Skeleton baseColor={'#e6f9e9'} highlightColor={'#fff'} /> : rights && rights.length !== 0 ? <div className={style.object__blockTableTd1}><p>{hideLastSixCharacters(inputString)}</p></div> : <div className={style.closedData}><p>данные по запросу</p></div>}
            {/* <div className={style.closedData}>{rights ? <p>{hideLastSixCharacters(inputString)}</p> || <p>данные по запросу</p> : <Skeleton />}</div> */}
          </div>
        </div>
        <div className={style["oform-recip-line"]}></div>
        <div className={style["object__block-title1"]}>
          <h2>{'Ограничения'}</h2>
        </div>
        <div className={style.object__blockTable1}>
          {(encumbrances && encumbrancesCheck.length !== 0) ? outputObjectSession() : outputObjectSession1()}
        </div>

          <div className={style["oform-recip-line"]}></div>
          <div className={(encumbrances && encumbrancesCheck?.length !== 0) ? style.statusInfo1 : style.statusInfo }>
            {/* {rights ?
              <ul className={style.egrnList}>
                <div className={style.needRaports}><li><a href="/" title='выписка об основных характеристиках'>Отчет об основных характеристиках</a></li><span>{`(рекомендуемый)`}</span></div>
                <li>Отчет о переходе прав</li>
                <div className={style.needRaports}><li>Отчет о собственниках</li><span>{`(рекомендуемый)`}</span></div>
                <li><a href="/kadastrovaya_stoimost" title='Справка о кадастровой стоимости'>Справка о кадастровой стоимости</a></li>
                {areaType ==='009' && <li><a href="/kadastrovaya-karta" title='Публичная кадастровая карта'>Публичная кадастровая карта</a></li> }
              </ul>
            :
            <>
              <ul className={style.egrnList}>
              <div className={style.needRaports}><li><a href="/">Отчет об основных характеристиках</a></li><span>{`(рекомендуемый)`}</span></div>
                <li><a href="/kadastrovaya_stoimost">Справка о кадастровой стоимости</a></li>
                {areaType ==='009' && <li><a href="/kadastrovaya-karta">Публичная кадастровая карта</a></li> }
              </ul>
            </>
            } */}
              {(encumbrances && encumbrancesCheck?.length !== 0) ?

              <>
              <div className={style.encWarning}>Внимание! найдены обременения.</div>
                <ul className={style.egrnList2}>
                <div className={style.needRaports1}><li><a href="/" title='выписка об основных характеристиках'>Отчет об основных характеристиках</a></li><span>{`(настоятельно рекомендуем)`}</span></div>
                <div className={style.needRaports1}><li><a href="/kadastrovaya_stoimost" title='Справка о кадастровой стоимости'>Справка о кадастровой стоимости</a></li><span>{`(настоятельно рекомендуем)`}</span></div>
                <div className={style.needRaports1}><li><a href="/" title='выписка об основных характеристиках'>Отчет о переходе прав</a></li><span>{`(настоятельно рекомендуем)`}</span></div>
                {/* <div className={style.needRaports}><li>Отчет о собственниках</li><span>{`(рекомендуемый)`}</span></div> */}
                {areaType ==='009' && <li><a href="/kadastrovaya-karta" title='Публичная кадастровая карта'>Публичная кадастровая карта</a></li> }
              </ul>
              </>
               :
               <>
                <ul className={style.egrnList}>
                  <div className={style.needRaports}><li><a href="/" title='выписка об основных характеристиках'>Отчет об основных характеристиках</a></li><span>{`(рекомендуемый)`}</span></div>
                  <div className={style.needRaports}><li><a href="/kadastrovaya_stoimost" title='Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно'>Кадастровая стоимость</a></li><span>{`(выбор клиентов)`}</span></div>
                  {/* <li>Отчет о переходе прав</li> */}
                  {/* <div className={style.needRaports}><li>Отчет о собственниках</li><span>{`(рекомендуемый)`}</span></div> */}
                  {areaType ==='009' && <li><a href="/kadastrovaya-karta" title='Публичная кадастровая карта'>Публичная кадастровая карта</a></li> }
                </ul>
               </>
              }
            {/* <div className="dataText">Статус: одобрено</div>
            <div className="dataText">Данные: запрошены</div>
            <div className="dataRisk">Риски: отсутствуют</div> */}

          </div>
          {/* <div className="oform-recip-footertext">Заявка: в процессе формирования</div> */}
         {/* <Link to="egrn" smooth="true" spy={true} duration={500}><div className="btnHistory1"><span>проверить абонента</span></div></Link> */}
         {/* <Link href={'/kto-zvonil'}><div className={style.btnHistory1}><span>проверить абонента</span></div></Link> */}
         {/* {fromBack && <div className={style.historyInfo2}>Сведения о праве собственности загружены из архива и могут отличаться от актуальных. Рекомендуем заказать отчет о переходе прав.</div>} */}

          {/* {!activate ?
            isVisible && (
              <div className="showPromocode"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setActivate(true);
                    notifySale()
                  }, 1000);
                }}
              >
                {loading ? (
                  <div className={style.pulseLoader3}>
                    <PulseLoader color="#AFB6BE" size={10} />
                  </div>
                ) : (
                  <div>
                    Получить скидку <span style={{ color: getTextColor() }}>{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="showPromocodeTrue">Скидка 20%</div>
            )} */}

      </div>
    </div>
    </>
  )
}

export default OwnersShot

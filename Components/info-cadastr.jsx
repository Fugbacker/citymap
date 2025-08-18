import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PulseLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import ChartCadCostHistory from './chartCadCostHistory';
import Link from 'next/link'
import { Link as ScrollLink } from 'react-scroll'
import  { useSession } from 'next-auth/react'
import { ModalWindow } from './modalWindow'
import style from '../styles/File.module.css'
import axios from 'axios';


const Cadastr = ({ cadastrObj, activate, setPromoCode, setActivate, promoCode, setIsVisible, isVisible, cadastrData}) => {
  const [ready, setReady] = useState(false)
  const [modalActive, setModalActive] = useState(false)
  const [historyCadCost, setHistoryCadCost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 10 минут в секундах
  const [raport, setRaport] = useState('')
  const router = useRouter()
  const path = router?.asPath

  const landCategories = [
    { code: "003001000000", name: "Земли сельскохозяйственного назначения" },
    { code: "003002000000", name: "Земли населенных пунктов" },
    { code: "003003000000", name: "Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения" },
    { code: "003004000000", name: "Земли особо охраняемых территорий и объектов" },
    { code: "003005000000", name: "Земли лесного фонда" },
    { code: "003006000000", name: "Земли водного фонда" },
    { code: "003007000000", name: "Земли запаса" },
    { code: "003008000000", name: "Категория не установлена" }
  ];

  const realEstateCategories = [
    { code: "002001001000", name: "Земельный участок" },
    { code: "002001002000", name: "Здание" },
    { code: "002001003000", name: "Помещение" },
    { code: "002001004000", name: "Сооружение" },
    { code: "002001005000", name: "Объект незавершённого строительства" },
    { code: "002001006000", name: "Предприятие как имущественный комплекс" },
    { code: "002001008000", name: "Единый недвижимый комплекс" },
    { code: "002001009000", name: "Машино-место" },
    { code: "002001010000", name: "Иной объект недвижимости" }
  ];

  // const propertyTypes = [
  //   { code: "206001000000", name: "Нежилое" },
  //   { code: "206002000000", name: "Жилое" }
  // ];

  const partOfpath = path?.split('/')[1]
  const cadObj = JSON.parse(cadastrObj)

  const objectCn = cadObj?.objectData?.objectCn || cadObj?.objectCn || cadObj?.[0]?.objectCn || cadObj?.properties?.options?.cad_num || cadObj?.result?.object?.number || cadObj?.elements?.[0]?.cadNumber || cadObj?.data?.features?.[0]?.properties?.options?.cad_number || cadObj?.data?.features?.[0]?.properties?.options?.cad_num || cadObj?.data?.features?.[1]?.properties?.options?.cad_number || cadObj?.data?.features?.[1]?.properties?.options?.cad_num || cadastrData?.[0]?.cadnum || cadObj?.features?.[0]?.properties?.options?.cad_number || cadObj?.features?.[0]?.properties?.options?.cad_num || 'Не определено'

  const addressNotes = cadObj?.objectData?.objectAddress?.addressNotes || cadObj?.objectData?.objectAddress?.mergedAddress || cadObj?.addressNotes || cadObj?.[0]?.addressNotes || cadObj?.objectData?.address?.mergedAddress || cadObj?.objectData?.objectAddress || cadObj?.properties?.options?.readable_address || cadObj?.result?.object?.address || cadObj?.elements?.[0]?.address?.readableAddress || cadObj?.data?.features?.[0]?.properties?.options?.readable_address || cadObj?.data?.features?.[1]?.properties?.options?.readable_address || cadastrData?.[0]?.full_name || cadObj?.features?.[0]?.properties?.options?.readable_address || 'Не определено'

  const objectName = cadObj?.objectData?.objectName || cadObj?.objectData?.objectDesc || cadObj?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadObj?.elements?.[0]?.objType)?.name || cadObj?.data?.features?.[0]?.properties?.options?.type || cadObj?.data?.features?.[0]?.properties?.options?.land_record_type || cadObj?.data?.features?.[1]?.properties?.options?.type || cadObj?.data?.features?.[1]?.properties?.options?.land_record_type || cadObj?.features?.[0]?.properties?.options?.params_type || cadObj?.features?.[0]?.properties?.options?.land_record_type || cadObj?.features?.[0]?.properties?.options?.building_name || 'Объект'


  const objectNameLetter = objectName?.[0]
  const name = cadObj?.flat?.price?.flat?.name
  const floor = cadObj?.flat?.price?.flat?.floor || cadObj?.elements?.[0]?.levelFloor
  const rightType = cadObj?.rights?.realty?.rights
  const rigthType1 = cadObj?.data?.features?.[0]?.properties?.options?.ownership_type || cadObj?.data?.features?.[1]?.properties?.options?.ownership_type || cadObj?.features?.[0]?.properties?.options?.ownership_type || cadObj?.features?.[0]?.properties?.options?.right_type


  const {
    categoryTypeValue, utilByDoc, dateCost, oksUFloors, ciSurname, ciFirst, ciPatronymic, ciNCertificate, ciPhone, ciEmail
  } = cadObj?.parcelData ?? {}

  const oksYearBuilt = cadObj?.parcelData?.oksYearBuilt || cadObj?.elements?.[0]?.oksYearBuild || cadObj?.data?.features?.[0]?.properties?.options?.year_built || cadObj?.data?.features?.[1]?.properties?.options?.year_built || cadObj?.features?.[0]?.properties?.options?.year_built

  const oksElementsConstructStr = cadObj?.parcelData?.oksElementsConstructStr || cadObj?.objectData?.building?.materials?.[0]?.wallStr || cadObj?.elements?.[0]?.oksWallMaterial

  const oksFloors = cadObj?.parcelData?.oksFloors || cadObj?.objectData?.building?.floors || cadObj?.elements?.[0]?.floor || cadObj?.data?.features?.[0]?.properties?.options?.floors || cadObj?.data?.features?.[1]?.properties?.options?.floors || cadObj?.features?.[0]?.properties?.options?.floors

  const cadCost = cadObj?.parcelData?.cadCost || cadObj?.objectData?.flat?.cadCostValue || cadObj?.objectData?.parcelData?.cadCostValue || cadObj?.objectData?.flat?.cadCostValue || cadObj?.objectData?.construction?.cadCostValue || cadObj?.objectData?.building?.cadCostValue || cadObj?.properties?.options?.cost_value || cadObj?.result?.object?.cost || cadObj?.elements?.[0]?.cadCost || cadObj?.data?.features?.[0]?.properties?.options?.cost_value || cadObj?.data?.features?.[1]?.properties?.options?.cost_value || cadObj?.features?.[0]?.properties?.options?.cost_value

  const costIndex = cadObj?.features?.[0]?.properties?.options?.cost_index


  const areaValue = cadObj?.parcelData?.areaValue || cadObj?.objectData?.flat?.area || cadObj?.objectData?.building?.area || cadObj?.properties?.options?.land_record_area || cadObj?.result?.object?.area || cadObj?.elements?.[0]?.area || cadObj?.data?.features?.[0]?.properties?.options?.area || cadObj?.data?.features?.[0]?.properties?.options?.specified_area || cadObj?.data?.features?.[1]?.properties?.options?.area || cadObj?.data?.features?.[1]?.properties?.options?.specified_area || cadObj?.features?.[0]?.properties?.options?.area || cadObj?.features?.[0]?.properties?.options?.declared_area || cadObj?.features?.[0]?.properties?.options?.area || cadObj?.features?.[0]?.properties?.options?.specified_area || cadObj?.features?.[0]?.properties?.options?.build_record_area || cadObj?.features?.[1]?.properties?.options?.build_record_area

  const dateCreate = cadObj?.parcelData?.dateCreate || cadObj?.objectData?.flat?.dateCreate || cadObj?.objectData?.cadRecordDate || cadObj?.result?.object?.createdAt || cadObj?.elements?.[0]?.regDate && new Date(cadObj?.elements?.[0]?.regDate).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.registration_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.registration_date && new Date(cadObj?.data?.features?.[1]?.properties?.options?.registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.land_record_reg_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[1] || cadObj?.features?.[0]?.properties?.options?.land_record_reg_date


  const cadastrPrice = cadObj?.cadastrPrice
  const buildName = cadObj?.objectData?.building?.name || cadObj?.data?.features?.[0]?.properties?.options?.params_type || cadObj?.data?.features?.[0]?.properties?.options?.building_name || cadObj?.data?.features?.[1]?.properties?.options?.building_name

  const permittedUse = cadObj?.properties?.options?.permitted_use_established_by_document || cadObj?.result?.object?.allowedUsage || cadObj?.elements?.[0]?.permittedUseByDoc || cadObj?.data?.features?.[0]?.properties?.options?.permitted_use_established_by_document || cadObj?.data?.features?.[1]?.properties?.options?.permitted_use_established_by_document || cadObj?.features?.[0]?.properties?.options?.permitted_use_established_by_document

  const status = cadObj?.properties?.options?.previously_posted || cadObj?.result?.object?.status || cadObj?.data?.features?.[0]?.properties?.options?.common_data_status || cadObj?.data?.features?.[0]?.properties?.options?.previously_posted || cadObj?.data?.features?.[1]?.properties?.options?.common_data_status || cadObj?.data?.features?.[1]?.properties?.options?.previously_posted

  const kvartal = cadObj?.properties?.options?.kvartal
  const util_by_doc = cadObj?.properties?.options?.land_record_category_type || cadObj?.result?.object?.category || landCategories.find(item => item.code === cadObj?.elements?.[0]?.landCategory)?.name || cadObj?.data?.features?.[0]?.properties?.options?.land_record_category_type || cadObj?.data?.features?.[1]?.properties?.options?.land_record_category_type || cadObj?.features?.[0]?.properties?.options?.land_record_category_type

  const parcel_type = cadObj?.properties?.options?.land_record_type
  const date_cost = cadObj?.properties?.options?.cost_registration_date || cadObj?.result?.object?.costDefinedAt || cadObj?.elements?.[0]?.cadCostDate && new Date(cadObj?.elements?.[0]?.cadCostDate).toISOString().split('T')[0] || cadObj?.elements?.[0]?.cadCostRegistrationDate && new Date(cadObj?.elements?.[0]?.cadCostRegistrationDate).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.cost_registration_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.cost_registration_date && new Date(cadObj?.data?.features?.[1]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || cadObj?.features?.[0]?.properties?.options?.cost_registration_date

  const firActualDate = cadObj?.result?.object?.costUpdatedAt || cadObj?.elements?.[0]?.infoUpdateDate && new Date(cadObj?.elements?.[0]?.infoUpdateDate).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.systemInfo?.updated && new Date(cadObj?.data?.features?.[0]?.properties?.systemInfo?.updated).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.systemInfo?.updated && new Date(cadObj?.data?.features?.[1]?.properties?.systemInfo?.updated).toISOString().split('T')[0]

  const objectUsage = cadObj?.result?.object?.objectUsage

  const {
    numberTypeStr, normalizedNumberValue
  } = cadObj?.oldNumbers?.[0] ?? {}

  const { data: session } = useSession()
  const flatChecker = objectName === 'Квартира'
  const areaType = cadObj?.parcelData?.areaType


  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Добавляем нуль перед месяцем и днем, если они однозначные
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  };
  const customId = "Скопировано";
  const saleId = "Скидка активирована"
  const addedId = "Добавлено в избранное";

  const notify = () => {
    toast.success("Скопировано", {
      toastId: customId
    });
  }

  const notifySale = () => {
    toast.success("Скидка 20% активирована. Указанный процент скидки будет автоматически применен при оплате", {
      toastId: saleId,
      autoClose: 7000
    });
  }

  const notifyAdd = () => {
    toast.success("Добавлено в избранное", {
      toastId: addedId,
      autoClose: 3000
    });
  }
  // const notify = () => toast.success("Скопировано");

  const handleCopy = (data) => {
    const cost = data
    notify()
    const text = cost.toString()
    navigator.clipboard.writeText(text);
    // setCopied(true);
    // setTimeout(() => {
    //   setCopied(false);
    // }, 1500); // reset copied state after 1.5 seconds
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const getTextColor = () => {
    return timeLeft <= 60 && 'red';
  };

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
    setReady(false)
    setTimeout(() => {
      setReady(true)
    }, 300)
  }, [])

  const paramInfo = {
    'Кадастровый номер:': <div className={style.cadcost} ><b>{objectCn}</b><span className={style.copyText} onClick={() => handleCopy(objectCn)}></span></div>,
    [numberTypeStr]: normalizedNumberValue,
    'Адрес:': addressNotes !== '0' && addressNotes,
    'Тип:':  objectNameLetter !== '0' && (name || objectName) || categoryTypeValue,
    'Название объекта:': objectUsage,
    'Тип собственности:':  rightType?.reduce((acc, rec) => rec.typeName, ' ') || rigthType1,
    'Название:': buildName,
    'Категория земель:':  utilByDoc || util_by_doc,
    'Разрешенное использование': permittedUse,
    'Статус:': status,
    'Площадь:': areaValue !== 0 && areaValue && `${areaValue} кв. м.`,
    'Этаж:': floor,
    'Материалы стен:': oksElementsConstructStr,
    'Этажность:': oksFloors,
    'Количество подземных этажей:': oksUFloors,
    'Год постройки:': oksYearBuilt,
    'Дата постановки на учёт:': dateCreate,
    'Дата обновления информации:': firActualDate,
    'Кадастровый сертификат:': ciNCertificate,
    'Телефон кадастрового инженера:': ciPhone,
    'Почтовый ящик кадастрового инженера:': ciEmail,
    'Кадастровая стоимость:': cadCost && <div className={style.cadcost}>{cadastrPrice || cadCost} руб. <span
      className={style.cadCostWarning}
      onClick={() => {setModalActive(true), setRaport('costWarning')}}
    ></span><span className={style.copyText} onClick={() => handleCopy(cadastrPrice || cadCost)}> </span>
    </div>,
    'Кадастровая стоимость 1 кв. м.': costIndex && (`${costIndex} руб.`),
    // 'Дата запроса информации:':getCurrentDate(),
    'Публичная кадастровая карта:': (areaType === '009' || cadObj?.data?.features?.[0]?.properties?.category === 36368) && <Link href={`/kadastrovaya-karta`} title="публичная кадастровая карта"><b>{objectCn}</b></Link>
  }

  const outputObject = () => {
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className={style.object__blockTableTr}>
          <div className={style.object__blockTableTd}>{it}</div>
          <div className={style.object__blockTableTd}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const paramInfo2 = {
    'Кадастровая стоимость:': <div className={style.cadcost}><b>{cadCost} руб.</b></div>,
    'Дата утверждения стоимости:': dateCost,
    // 'Технический паспорт МКД': flatChecker && <Link href={`/kadastrovaya-karta`}><b>{objectCn} (посмотреть)</b></Link>
  }

  // const outputObject2 = () => {
  //   return Object.keys(paramInfo2).map((it) => {
  //     return paramInfo2[it] && (
  //       <div key={it} className="object__blockTableTr">
  //         <div className="object__blockTableTd">{it}</div>
  //         <div className="object__blockTableTd">{paramInfo2[it]}</div>
  //       </div>
  //     )
  //   })
  // }

  const history = async () => {
    const history =await axios(`/api/cadCostHistory?cadNumber=${objectCn}`)
    setHistoryCadCost(history?.data)

  }

  useEffect(() => {
    history()
  }, [objectCn])


  return (
    <>
      <div data-content="kadastr" id="kadastr-info" className={partOfpath === 'cn' ? style.object__block : style.object__block2}>
        <div className={style["object__block-wrap"]}>
          {/* <div className={style["object__block-title"]}><h2>Справочные кадастровые сведения</h2></div> */}
          {/* {!session && <div className="flatTableHead">
            <div className="cadCost">Cведения об объекте недвижимости c кадастровым номером {objectCn}</div>
          </div>} */}
          <div className={style.object__blockTable}>
            {outputObject()}
          </div>
          {historyCadCost.length > 1 && <div className={style.costHistory}>
            <div className={style.object__blockTableTd}>Изменение кадастровой стоимости:</div>
            <ChartCadCostHistory data={historyCadCost}/>
          </div>}
        </div>
        {/* {!session ?<div className="btnHistory"><Link to="egrn" smooth="true" spy={true} duration={500}><span>Заказать отчет</span></Link></div>:''} */}
          {/* <div className={style.historyInfo1}><p><strong>Внимание!</strong> Бесплатная информация о кадастровой стоимости объета недвижимости {objectCn} носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальную кадастровую стоимость, необходимо заказать справку о кадастровой стоимости объекта недвижимости.</p></div> */}
          <div className={style.infoCadastrContainer}>
          <ScrollLink to="egrn" smooth="true" spy={true} duration={500} className="btnHistory">
            <div className="stack" style={{'--stacks': 3}}>
              <span style={{'--index': 0}}>Выбрать отчеты</span>
              <span style={{'--index': 1}}>Выбрать отчеты</span>
              <span style={{'--index': 2}}>Выбрать отчеты</span>
            </div>
          </ScrollLink>
          {!activate && isVisible &&
            (
              <div className="btnHistory1"
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
            )}
            {/* {isVisible &&
                <div className="btnHistory2"
                onClick={() => {
                  setIsVisible(false);
                  notifyAdd()
                }}
              ><span>Добавить в избранное</span></div>
            } */}

          </div>

          {/* <div className={style.historyInfo2}><p><strong>Внимание!</strong> Кадастровые сведения носят исключительно информационный характер и могут отличаться от актуальных. Для того, чтобы узнать кадастровую стоимость, которая требуется для расчета имущественного и земельного налогов, необходимо заказать справку о кадастровой стоимости объекта недвижимости, а для получения актуальных кадастровых сведений необходимо заказать отчет из ЕГРН об основных характеристиках.</p></div> */}
          {/* {ready && <div className={style.historyInfo1}><p>Кадастровые сведения носят исключительно информационный характер и могут отличаться от актуальных. Для того, чтобы узнать кадастровую стоимость, которая требуется для расчета имущественного и земельного налогов, необходимо заказать справку о кадастровой стоимости объекта недвижимости, а для получения актуальных кадастровых сведений необходимо заказать отчет об основных характеристиках. Для получения информации о текущих владельцах необходимо заказать отчет собственниках. Если ФИО собственников не принципиально, достаточно заказать отчет о переходе прав.</p></div>} */}
          {/* <div className={style.historyInfo1}>
            <ul className={style.egrnList}>
              <div className={style.needRaports}><li><a href="/" title='выписка об основных характеристиках'>Отчет об основных характеристиках</a></li><span>{`(рекомендуемый)`}</span></div>
              <li>Отчет о переходе прав</li>
              <div className={style.needRaports}><li>Отчет о собственниках</li><span>{`(рекомендуемый)`}</span></div>
              <li><a href="/kadastrovaya_stoimost" title='Справка о кадастровой стоимости'>Справка о кадастровой стоимости</a></li>
              {areaType ==='009' && <li><a href="/kadastrovaya-karta" title='Публичная кадастровая карта'>Публичная кадастровая карта</a></li> }
            </ul>
          </div> */}
        {/* <div className="historyInfo">Открытая справочная информация, полученная из Росреестра, по кадастровому номеру {objectCn} на основе выписки из ЕГРН</div> */}
      </div>
      {/* {cadCost !== 0 && cadCost && (
        <div data-content="kadastr" id="kadastr-info" className="object__block">
          <div className="object__block-wrap">
            <div className="object__block-title _kadastr"><h2>Кадастровая стоимость</h2></div>
            <div className="flatTableHead">
            {!session ? <div className="cadCost">Кадастровая стоимость объекта недвижимости с номером {objectCn} - {cadCost} рублей.</div>:''}
            </div>
            <div className="clearfix"> </div>
            <div className="object__blockTable">
              {outputObject2()}
            </div>
          </div>
          {!session ?<div className="btnHistory"><Link to="egrn" smooth="true" spy={true} duration={500}><span>Заказать справку</span></Link></div>:''}
          <div className="historyInfo1">Бесплатная информация о кадастровой стоимости объета недвижимости {objectCn} носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальную кадастровую стоимость, необходимо заказать справку о кадастровой стоимости объекта недвижимости.</div>
        </div>
      )} */}
      <ModalWindow active={modalActive} setActive={setModalActive} raport={raport}/>
    </>
  )
}

export default Cadastr

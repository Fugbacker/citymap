import React from 'react'
import { Link } from 'react-scroll'
import  { useSession } from 'next-auth/react'
import style from '../styles/File.module.css'
import ChartCadCostHistory from './chartCadCostHistory';

const InfoCadastrReport = ({ cadastrObj }) => {
  const cadObj = JSON.parse(cadastrObj)


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


  const objectCn = cadObj?.objectData?.objectCn || cadObj?.objectCn || cadObj?.[0]?.objectCn || cadObj?.properties?.options?.cad_num || cadObj?.result?.object?.number || cadObj?.elements?.[0]?.cadNumber || cadObj?.data?.features?.[0]?.properties?.options?.cad_number || cadObj?.data?.features?.[0]?.properties?.options?.cad_num || cadObj?.data?.features?.[1]?.properties?.options?.cad_number || cadObj?.data?.features?.[1]?.properties?.options?.cad_num

  const addressNotes = cadObj?.objectData?.objectAddress?.addressNotes || cadObj?.objectData?.objectAddress?.mergedAddress || cadObj?.addressNotes || cadObj?.[0]?.addressNotes || cadObj?.objectData?.address?.mergedAddress || cadObj?.objectData?.objectAddress || cadObj?.properties?.options?.readable_address || cadObj?.result?.object?.address || cadObj?.elements?.[0]?.address?.readableAddress || cadObj?.data?.features?.[0]?.properties?.options?.readable_address || cadObj?.data?.features?.[1]?.properties?.options?.readable_address

  const objectName = cadObj?.objectData?.objectName || cadObj?.objectData?.objectDesc || cadObj?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadObj?.elements?.[0]?.objType)?.name || cadObj?.data?.features?.[0]?.properties?.options?.type || cadObj?.data?.features?.[0]?.properties?.options?.land_record_type || cadObj?.data?.features?.[1]?.properties?.options?.type || cadObj?.data?.features?.[1]?.properties?.options?.land_record_type || 'Объект'

  const objectNameLetter = objectName[0]
  const name = cadObj?.flat?.price?.flat?.name
  const floor = cadObj?.flat?.price?.flat?.floor || cadObj?.elements?.[0]?.levelFloor
  const rightType = cadObj?.rights?.realty?.rights
  const rigthType1 = cadObj?.data?.features?.[0]?.properties?.options?.ownership_type || cadObj?.data?.features?.[1]?.properties?.options?.ownership_type
  const {
    categoryTypeValue, utilByDoc, dateCost, oksUFloors, ciSurname, ciFirst, ciPatronymic, ciNCertificate, ciPhone, ciEmail
  } = cadObj?.parcelData ?? {}

  const oksYearBuilt = cadObj?.parcelData?.oksYearBuilt || cadObj?.elements?.[0]?.oksYearBuild || cadObj?.data?.features?.[0]?.properties?.options?.year_built || cadObj?.data?.features?.[1]?.properties?.options?.year_built

  const oksElementsConstructStr = cadObj?.parcelData?.oksElementsConstructStr || cadObj?.objectData?.building?.materials?.[0]?.wallStr || cadObj?.elements?.[0]?.oksWallMaterial

  const oksFloors = cadObj?.parcelData?.oksFloors || cadObj?.objectData?.building?.floors || cadObj?.elements?.[0]?.floor || cadObj?.data?.features?.[0]?.properties?.options?.floors || cadObj?.data?.features?.[1]?.properties?.options?.floors

  const cadCost = cadObj?.parcelData?.cadCost || cadObj?.objectData?.flat?.cadCostValue || cadObj?.objectData?.parcelData?.cadCostValue || cadObj?.objectData?.flat?.cadCostValue || cadObj?.objectData?.construction?.cadCostValue || cadObj?.objectData?.building?.cadCostValue || cadObj?.properties?.options?.cost_value || cadObj?.result?.object?.cost || cadObj?.elements?.[0]?.cadCost || cadObj?.data?.features?.[0]?.properties?.options?.cost_value || cadObj?.data?.features?.[1]?.properties?.options?.cost_value


  const areaValue = cadObj?.parcelData?.areaValue || cadObj?.objectData?.flat?.area || cadObj?.objectData?.building?.area || cadObj?.properties?.options?.land_record_area || cadObj?.result?.object?.area || cadObj?.elements?.[0]?.area || cadObj?.data?.features?.[0]?.properties?.options?.area || cadObj?.data?.features?.[0]?.properties?.options?.specified_area || cadObj?.data?.features?.[1]?.properties?.options?.area || cadObj?.data?.features?.[1]?.properties?.options?.specified_area

  const dateCreate = cadObj?.parcelData?.dateCreate || cadObj?.objectData?.flat?.dateCreate || cadObj?.objectData?.cadRecordDate || cadObj?.result?.object?.createdAt || cadObj?.elements?.[0]?.regDate && new Date(cadObj?.elements?.[0]?.regDate).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.registration_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.registration_date && new Date(cadObj?.data?.features?.[1]?.properties?.options?.registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.land_record_reg_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[1]


  const cadastrPrice = cadObj?.cadastrPrice
  const buildName = cadObj?.objectData?.building?.name || cadObj?.data?.features?.[0]?.properties?.options?.params_type || cadObj?.data?.features?.[0]?.properties?.options?.building_name || cadObj?.data?.features?.[1]?.properties?.options?.building_name

  const permittedUse = cadObj?.properties?.options?.permitted_use_established_by_document || cadObj?.result?.object?.allowedUsage || cadObj?.elements?.[0]?.permittedUseByDoc || cadObj?.data?.features?.[0]?.properties?.options?.permitted_use_established_by_document || cadObj?.data?.features?.[1]?.properties?.options?.permitted_use_established_by_document

  const status = cadObj?.properties?.options?.previously_posted || cadObj?.result?.object?.status || cadObj?.data?.features?.[0]?.properties?.options?.common_data_status || cadObj?.data?.features?.[0]?.properties?.options?.previously_posted || cadObj?.data?.features?.[1]?.properties?.options?.common_data_status || cadObj?.data?.features?.[1]?.properties?.options?.previously_posted

  const kvartal = cadObj?.properties?.options?.kvartal
  const util_by_doc = cadObj?.properties?.options?.land_record_category_type || cadObj?.result?.object?.category || landCategories.find(item => item.code === cadObj?.elements?.[0]?.landCategory)?.name || cadObj?.data?.features?.[0]?.properties?.options?.land_record_category_type || cadObj?.data?.features?.[1]?.properties?.options?.land_record_category_type

  const parcel_type = cadObj?.properties?.options?.land_record_type
  const date_cost = cadObj?.properties?.options?.cost_registration_date || cadObj?.result?.object?.costDefinedAt || cadObj?.elements?.[0]?.cadCostDate && new Date(cadObj?.elements?.[0]?.cadCostDate).toISOString().split('T')[0] || cadObj?.elements?.[0]?.cadCostRegistrationDate && new Date(cadObj?.elements?.[0]?.cadCostRegistrationDate).toISOString().split('T')[0] || cadObj?.data?.features?.[0]?.properties?.options?.cost_registration_date && new Date(cadObj?.data?.features?.[0]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || cadObj?.data?.features?.[1]?.properties?.options?.cost_registration_date && new Date(cadObj?.data?.features?.[1]?.properties?.options?.cost_registration_date).toISOString().split('T')[0]

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

  const paramInfo = {
    'Кадастровый номер:': <b>{objectCn}</b>,
    [numberTypeStr]: normalizedNumberValue,
    'Адрес:': addressNotes !== '0' && addressNotes,
    'Тип:':  objectNameLetter !== '0' && (name || objectName) || categoryTypeValue,
    'Название объекта:': objectUsage,
    'Тип собственности:':  rightType?.reduce((acc, rec) => rec.typeName, ' '),
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
    // 'Кадастровый инженер:': ciSurname ? `${ciSurname} ${ciFirst?.slice(0,1)}. ${ciPatronymic?.slice(0,1)}.`:'не известно',
    'Кадастровый сертификат:': ciNCertificate,
    'Телефон кадастрового инженера:': ciPhone,
    'Почтовый ящик кадастрового инженера:': ciEmail,
    // 'Кадастровая стоимость:': <div className={style.cadcost}><b>{cadCost} руб.</b></div>,
    // 'Кадастровая стоимость:': <div className={style.cadcost}>{cadastrPrice ||cadCost} руб.</div>,
    // 'Кадастровая стоимость:': <div className={style.closedData}><p>данные по запросу</p></div>,
    'Кадастровая стоимость:': <div className={style.cadcost}>{cadastrPrice || cadCost} руб. </div>,
    'Дата утверждения стоимости:': dateCost || date_cost,
    // 'Дата запроса информации:':getCurrentDate(),

  }

  const outputObject = () => {
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} style={{display: 'table-row'}}>
          <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
          <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  return (
    <>
      <div style={{ marginBottom: '15px', padding: '10px 0' }}>
        <div><h2>Кадастровые сведения</h2></div>
        <div style={{ display: 'table', width: '100%' }}>
          {outputObject()}
        </div>
        <div style={{ textAlign: 'justify', color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px', fontWeight: 'bold' }}>Бесплатная информация о кадастровой стоимости объекта недвижимости {objectCn} носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальную кадастровую стоимость, необходимо заказать справку о кадастровой стоимости объекта недвижимости.</div>
      </div>
    </>
  )
}

export default InfoCadastrReport

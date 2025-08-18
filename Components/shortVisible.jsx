import React from 'react'
import style from '../styles/File.module.css'

export const ShortVisible = ({ cadastrObj, rightsObj, objName }) => {
  const cadObj = JSON.parse(cadastrObj)
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


  const objectCn = cadObj?.objectData?.objectCn || cadObj?.objectCn || cadObj?.properties?.options?.cad_num || cadObj?.result?.object?.number || cadObj?.elements?.[0]?.cadNumber || cadObj?.data?.features?.[0]?.properties?.options?.cad_number || cadObj?.data?.features?.[0]?.properties?.options?.cad_num || cadObj?.[0]?.cadnum
  const addressNotes = cadObj?.objectData?.objectAddress?.addressNotes || cadObj?.objectData?.objectAddress?.mergedAddress || cadObj?.addressNotes || cadObj?.objectData?.address?.mergedAddress || cadObj?.objectData?.objectAddress || cadObj?.properties?.options?.readable_address || cadObj?.result?.object?.address || cadObj?.elements?.[0]?.address?.readableAddress || cadObj?.data?.features?.[0]?.properties?.options?.readable_address || cadObj?.[0]?.full_name
  const objectName = cadObj?.objectData?.objectName || cadObj?.objectData?.objectDesc || cadObj?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadObj?.elements?.[0]?.objType)?.name || cadObj?.data?.features?.[0]?.properties?.options?.type || cadObj?.data?.features?.[0]?.properties?.options?.land_record_type || objName || 'Объект'
  const objectNameLetter = objectName[0]
  const { name } = cadObj?.flat?.price?.flat ?? {}
  const rights = rightsObj?.realty?.rights || rightsObj?.rights?.realty?.rights || rightsObj?.rightEncumbranceObjects
  const rightsCount = rightsObj?.realty?.rights?.filter((it) => it?.rightState === 1).length || rightsObj?.rights?.realty?.rights?.filter((it) => it?.rightState === 1).length || rightsObj?.rightEncumbranceObjects?.length

  const inputString = rights?.[0]?.rightData?.regNum || rights?.[0]?.encumbrances?.[0]?.regNum || rights?.[0]?.regNmbr

  const hideLastSixCharacters = (inputString) => {
    const visibleLength = inputString?.length - 6;
    const visiblePart = inputString?.substring(0, visibleLength);
    const hiddenPart = inputString?.substring(visibleLength)?.replace(/./g, '*');
    return visiblePart + hiddenPart;
  };

  const paramInfo = {
    'Тип:':  objectNameLetter !== '0' && (name || objectName),
    'Адрес:': addressNotes !== '0' && addressNotes,
    'Кадастровый номер:': <b>{objectCn}</b>,
    // 'Количество собственников:': rightsCount || <div className={style.closedData}><p>данные по запросу</p></div>,
    // 'Регистрационный номер:': hideLastSixCharacters(inputString) || <div className={style.closedData}><p>данные по запросу</p></div>,
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

  return (
    <div data-content="kadastr" id="kadastr-info" className={style.object__block}>
    <div className={style["object__block-wrap"]}>
      {/* <div className={style["object__block-title"]}><h2>Справочные кадастровые сведения</h2></div> */}
      <div className={style.object__blockTable}>
        {outputObject()}
      </div>
    </div>
  </div>
  )
}

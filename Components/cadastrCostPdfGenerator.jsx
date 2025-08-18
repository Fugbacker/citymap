import React from 'react'
import dayjs from 'dayjs'
import regionNamesGenitive from './files/regionRusGenitive'
import QRCode from "react-qr-code"
import ReactDOMServer from 'react-dom/server'

 const CadastrCostPdfGenerator = ({ object }) => {
    // console.log('object', object?.data?.features?.[0]?.properties?.options)



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


  const dateCost = object?.parcelData?.dateCost || object?.objectData?.parcelData?.actualDate || object?.objectData?.flat?.actualDate || object?.objectData?.construction?.actualDate || object?.objectData?.building?.actualDate || object?.result?.object?.costDefinedAt || object?.elements?.[0]?.cadCostDate && new Date(object?.elements?.[0]?.cadCostDate).toISOString().split('T')[0] || object?.elements?.[0]?.cadCostRegistrationDate && new Date(object?.elements?.[0]?.cadCostRegistrationDate).toISOString().split('T')[0] || object?.data?.features?.[0]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[0]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || object?.data?.features?.[1]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[1]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || object?.features?.[0]?.properties?.options?.cost_registration_date || 'данные отсутствуют'

  const dateCreate = object?.parcelData?.dateCreate || object?.objectData?.parcelData?.dateCreated || object?.objectData?.flat?.dateCreated || object?.objectData?.construction?.dateCreated || object?.objectData?.building?.dateCreated || object?.result?.object?.createdAt || object?.elements?.[0]?.cadCostRegistrationDate && new Date(object?.elements?.[0]?.cadCostRegistrationDate).toISOString().split('T')[0] || object?.data?.features?.[0]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[0]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || object?.data?.features?.[1]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[1]?.properties?.options?.cost_registration_date).toISOString().split('T')[0] || object?.features?.[0]?.properties?.options?.cost_registration_date || 'данные отсутствуют'

  const cadCost = object?.cadastrPrice || object?.parcelData?.cadCost || object?.objectData?.parcelData?.cadCostValue || object?.objectData?.flat?.cadCostValue || object?.objectData?.construction?.cadCostValue || object?.objectData?.building?.cadCostValue || object?.result?.object?.cost || object?.elements?.[0]?.cadCost || object?.data?.features?.[0]?.properties?.options?.cost_value || object?.data?.features?.[1]?.properties?.options?.cost_value || object?.features?.[0]?.properties?.options?.cost_value ||'данные отсутствуют'

  const objectCn = object?.objectData?.objectCn || object?.object?.objectCn || object?.objectCn || object?.result?.object?.number || object?.elements?.[0]?.cadNumber || object?.data?.features?.[0]?.properties?.options?.cad_number || object?.data?.features?.[0]?.properties?.options?.cad_num || object?.data?.features?.[1]?.properties?.options?.cad_number || object?.data?.features?.[1]?.properties?.options?.cad_num || object?.features?.[0]?.properties?.options?.cad_number || object?.features?.[0]?.properties?.options?.cad_num || 'данные отсутствуют'

  const addressNotes = object?.objectData?.objectAddress?.addressNotes || object?.objectData?.objectAddress?.mergedAddress || object?.addressNotes || object?.objectData?.address?.mergedAddress || object?.objectData?.objectAddress || object?.result?.object?.address || object?.elements?.[0]?.address?.readableAddress || object?.data?.features?.[0]?.properties?.options?.readable_address || object?.data?.features?.[1]?.properties?.options?.readable_address || object?.features?.[0]?.properties?.options?.readable_address || 'данные отсутствуют'

  let objectName = object?.objectData?.objectName || object?.objectData?.objectDesc || object?.result?.object?.objectType || realEstateCategories.find(item => item.code === object?.elements?.[0]?.objType)?.name || object?.data?.features?.[0]?.properties?.options?.type || object?.data?.features?.[0]?.properties?.options?.land_record_type || object?.data?.features?.[1]?.properties?.options?.type || object?.data?.features?.[1]?.properties?.options?.land_record_type  || object?.features?.[0]?.properties?.options?.params_type || object?.features?.[0]?.properties?.options?.land_record_type || object?.features?.[0]?.properties?.options?.building_name || 'Объект'

  if (objectName === '01') {
    objectName = 'Объект'
  }

//   const ccDateValuation = object?.objectData?.parcelData?.ccDateValuation || object?.objectData?.flat?.ccDateValuation || object?.objectData?.construction?.ccDateValuation || object?.objectData?.building?.ccDateValuation || object?.result?.object?.costDefinedAt || object?.elements?.[0]?.cadCostDeterminationDate && new Date(object?.elements?.[0]?.cadCostDeterminationDate).toISOString().split('T')[0] || object?.data?.features?.[0]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[0]?.properties?.options?.cost_determination_date).toISOString().split('T')[0] || object?.data?.features?.[1]?.properties?.options?.cost_registration_date && new Date(object?.data?.features?.[1]?.properties?.options?.cost_determination_date).toISOString().split('T')[0] || 'данные отсутствуют'

  const ccDateValuation =  object?.objectData?.parcelData?.ccDateValuation ||  object?.objectData?.flat?.ccDateValuation ||  object?.objectData?.construction?.ccDateValuation ||  object?.objectData?.building?.ccDateValuation ||  object?.result?.object?.costDefinedAt ||  (object?.elements?.[0]?.cadCostDeterminationDate && object?.elements?.[0]?.cadCostDeterminationDate.trim() !== '' &&
    !isNaN(new Date(object?.elements?.[0]?.cadCostDeterminationDate).getTime()) &&
    new Date(object?.elements?.[0]?.cadCostDeterminationDate).toISOString().split('T')[0]) ||
  (object?.data?.features?.[0]?.properties?.options?.cost_registration_date &&
    object?.data?.features?.[0]?.properties?.options?.cost_determination_date.trim() !== '' &&
    !isNaN(new Date(object.data?.features?.[0]?.properties.options?.cost_determination_date).getTime()) &&
    new Date(object?.data?.features?.[0]?.properties?.options?.cost_determination_date).toISOString().split('T')[0]) ||
  (object?.data?.features?.[1]?.properties?.options?.cost_registration_date &&
    object?.data?.features?.[1]?.properties?.options?.cost_determination_date.trim() !== '' &&
    !isNaN(new Date(object?.data?.features?.[1]?.properties.options?.cost_determination_date).getTime()) &&
    new Date(object?.data?.features?.[1]?.properties.options?.cost_determination_date).toISOString().split('T')[0]) || object?.features?.[0]?.properties?.options?.cost_determination_date ||
  'данные отсутствуют';

  const regionKey = object?.objectData?.regionKey || object?.regionKey
  const regionName = regionNamesGenitive[regionKey]

  const historyCadPrices = object?.historyCadPrice || object?.historyCadPrices


//   <tr>
//   <td width="50%">Дата запроса кадастровой стоимости:</td>
//   <td width="50%">${secondFormattedDate}</td>
// </tr>
  const today = dayjs();
  const formattedDate = today.format('DD.MM.YYYY');
  const secondFormattedDate = today.format('YYYY-MM-DD');
  const qrCodeHtml = ReactDOMServer.renderToString( <QRCode size={50} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={`https://rosreestr.gov.ru`} />);
  const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta charset="utf-8"/>
  </head>
  <body>
  <div id="sidebar">
  <div id="outline">
  </div>
  </div>
  <div id="page-container">
    <div id="pf1">
        <div style="margin-bottom: 20px;">
        <table cellspacing="0" cellpadding="5" align="center">
            <tr>
                <td colspan="2" style="width: 5%">${qrCodeHtml}</td>
                <td colspan="2" style="width: 95%; text-align: center;">Справка о кадастровой стоимости объекта недвижимости</td>
            </tr>
        </table>
        <table cellspacing="0" cellpadding="5" align="center">
            <tr>
                <td colspan="2" align="center"><span style="border-bottom: 2px solid black">${regionName ? `Сведения получены из ФГИС Росреестра по ${regionName}`: `Сведения получены из ФГИС Росреестра`} </span></td>
            </tr>
            <tr>
                <td colspan="2">На основании поступившего запроса от ${formattedDate}, получены данные:</td>
            </tr>
        </table>
      </div>
        <table border="1" cellspacing="0" cellpadding="5" align="center">
          <tr>
              <td width="50%">Вид объекта недвижимости:</td>
              <td width="50%" >${objectName}</td>
          </tr>
          <tr>
              <td width="50%">Кадастровый номер:</td>
              <td width="50%">${objectCn}</td>
          </tr>
          <tr>
              <td width="50%">Местоположение:</td>
              <td width="50%">${addressNotes}</td>
          </tr>
          <tr>
              <td width="50%">Кадастровая стоимость объекта недвижимости по состоянию на ${formattedDate}.</td>
              <td width="50%">${cadCost} руб.</td>
          </tr>
          <tr>
              <td width="50%">Дата внесения кадастровой стоимости в ЕГРН:</td>
              <td width="50%">${dateCreate}</td>
          </tr>
          <tr>
              <td width="50%">Дата утверждения кадастровой стоимости:</td>
              <td width="50%">${ccDateValuation}</td>
          </tr>
          <tr>
              <td width="50%">Дата определения кадастровой стоимости:</td>
              <td width="50%">${dateCost || dateCreate}</td>
          </tr>

          ${!historyCadPrices || historyCadPrices.length === 0 ? `
            <tr>
                <td width="50%">Сведения о пересмотре кадастровой стоимости:</td>
                <td width="50%">Данные отсутствуют</td>
            </tr>
          ` : historyCadPrices.map(item => `
            <tr>
                <td width="50%">Кадастровая стоимость объекта недвижимости после очередного пересмотра от ${item.determinationDate}.</td>
                <td width="50%">${item.cost} руб.</td>
            </tr>
          `).join('')}
          <tr>
              <td width="50%">Особые отметки:</td>
              <td width="50%">данные отсутствуют</td>
          </tr>
      </table>
  </div>
  </div>
  </body>
  </html>

`;

  return html;

}


export default CadastrCostPdfGenerator

//          <div class="t m0 x3 h2 y3 ff1 fs0 fc0 sc0 ls0 ws0">Филиал публично-правовой компании <span class="ff2">&quot;</span>Роскадастр<span class="ff2">&quot; </span>по Моск<span class="_ _0"></span>овск<span class="_ _1"></span>ой области</div>
// <div class="t m0 x4 h3 y4 ff1 fs1 fc0 sc0 ls0 ws0">полное наименование органа регистрации прав</div>
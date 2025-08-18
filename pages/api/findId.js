import axios from "axios";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const objectIdUrl = process.env.OBJECT_ID_URL;
const cadastrUrl1 = process.env.OBJECT_ID_URL1;

export default async function tooltips(req, res) {
  const adress = req.query.cadNumber;
  const encodeUri = `${objectIdUrl}${adress}`;
  const encodeUri1 = `${cadastrUrl1}${adress}`;

  let getAskId = null;
  let isFromBackup = false; // Флаг для отметки, что данные получены из второй базы

  try {
    // Пробуем выполнить первый запрос
    const { data: data1 } = await axios({
      method: 'GET',
      timeout: 1000 * 10,
      url: encodeURI(encodeUri),
    });

    // Если данные найдены в первом запросе
    if (data1 && data1.length !== 0) {
      console.log('ID from first request', data1[0].objectId);
      getAskId = data1[0].objectId;
    } else {
      throw new Error('No data found in first request');
    }

  } catch (error) {
    // Выполняем второй запрос, если первый не удался
    try {
      const { data: data2 } = await axios({
        method: 'GET',
        timeout: 1000 * 10,
        url: encodeURI(encodeUri1),
      });

      // Если данные найдены во втором запросе
      if (data2 && data2.length !== 0) {
        getAskId = data2[1].objectId;
      } else {
        getAskId = [];
      }

    } catch (secondError) {
      getAskId = [];
    }
  }


  // Возвращаем данные и флаг, указывающий, что данные могут быть старыми
  return res.json({getAskId});
}

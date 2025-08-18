import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const cadNumber = req.query.cadNumber
  function processCadastralNumber(cadastralNumber) {
    const blocks = cadastralNumber.split(':');
    const processedBlocks = blocks.map(block => {
      if (block === '0') {
        return '0'; // если блок состоит из всех нулей, оставляем один ноль
      } else {
        let clearedBlock = block.replace(/^0+/, ''); // убираем ведущие нули
        if (clearedBlock === '') {
          return '0'; // если блок был полностью составлен из нулей, оставляем один ноль
        }
        return clearedBlock.replace(/(^|:)0+/g, '$1'); // убираем нули, оставляя по одному в каждом блоке
      }
    });
    const processedCadastralNumber = processedBlocks.join(':');
    return processedCadastralNumber;
  }
  function coord3857To4326(coord) {
    const X = 20037508.34; // Максимальная долгота в метрах
    const long3857 = coord[0];  // Долгота в метрах
    const lat3857 = coord[1];    // Широта в метрах
    // Преобразование долготы
    const long4326 = (long3857 * 180) / X;
    // Преобразование широты
    let lat4326 = lat3857 / (X / 180);
    const exponent = (Math.PI / 180) * lat4326;
    lat4326 = Math.atan(Math.exp(exponent)) * (360 / Math.PI) - 90;
    return [lat4326,long4326];
  }

  try {
    const url = `https://pkk.torgi.me/api/features/1/${processCadastralNumber(cadNumber)}?date_format=%c&_=1688717978149`
    console.log('url', url)
    // const url = `https://pkk.rosreestr.ru/api/features/1/${processCadastralNumber(cadNumber)}?date_format=%c&_=1688717978149`
    const encodeUrl = encodeURI(url)

    let pkk = await axios({
      headers: {
        'Host': 'pkk.torgi.me',
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0'
      },
      method: 'GET',
      timeout: 1000 * 10,
      url: encodeUrl
    })
    // .then(({ data }) => {
    //   console.log('DATA', data)
    //   return data
    // })
    // .catch((e) => {
    //   console.log('ЧТО ТУТ', e)
    // })


    // const extent = pkk?.data?.feature?.extent
    const lat = pkk?.data?.feature?.center?.x
    const lng = pkk?.data?.feature?.center?.y

      // const arrayOfPionts = Object.values(extent)
      // console.log('obarrayOfPiontsject', arrayOfPionts)
      // const points = Object.entries(arrayOfPionts).map(entry => ({[entry[0]]: entry[1]}))
      // console.log('POINTS', points)

      // const coordinatePoints = await Promise.all(points.map((it) => {
      //   return axios(`https://epsg.io/srs/transform/${lat},${lng}.json?key=default&s_srs=3857&t_srs=4326`)
      // }))
      const coord = coord3857To4326([lat,lng])
      const latitude = {
        x: coord[0],
        y: coord[1],
        z: 0
      }
      console.log('coord', coord)


      // const decodnigUrl = `https://epsg.io/srs/transform/${lat},${lng}.json?key=default&s_srs=3857&t_srs=4326`
      // const decodingCenterCoordinate = await axios({
      //   headers: {
      //     'Access-Control-Allow-Origin': '*'
      //   },
      //   method: 'GET',
      //   timeout: 1000 * 15,
      //   url: decodnigUrl
      // })



      return res.json({
        pkk: pkk?.data?.feature,
        latitude:latitude
      })

  } catch {
    return res.json('error')
  }
}
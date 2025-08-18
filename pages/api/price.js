import axios from "axios"
import { MongoClient } from 'mongodb'
import regions from '../../Components/files/regions'
import regionsRus from '../../Components/files/rusRegions'
import tokenChange from '../../Components/files/tokenChanger'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function findFlat(req, res) {
  await client.connect()
  const cadastr = req.query.cadNum
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('searchingObjects')
  const cadastrObj = await collection.findOne({ $or : [{'objectData.objectCn': cadastr}, {'objectData.id':cadastr}]})
  const areaValue = cadastrObj?.parcelData?.areaValue || cadastrObj?.rights?.realty?.areaSize
  const address = cadastrObj?.objectData?.objectAddress?.addressNotes || cadastrObj?.objectData?.addressNote

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'

  const askdadata = await axios({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': tokenChange(),
      'Host': 'suggestions.dadata.ru',
    },
    url: encodeURI(url),
    data: {query: address, 'count':10}
  })
  // const askdadata = await axios(`https://mkdfond.ru/api/askdadata?cadNumber=${cadastr}`)

  const regionFiasCode = askdadata?.data?.suggestions?.[0]?.data?.region_fias_id
  const needRegionsForBase = regions[regionFiasCode]
  const city = askdadata?.data?.suggestions?.[0]?.data?.city
  const street = askdadata?.data?.suggestions?.[0]?.data?.street
  const houseNumber = askdadata?.data?.suggestions?.[0]?.data?.house
  const lat = askdadata?.data?.suggestions?.[0]?.data?.geo_lat
  const lon = askdadata?.data?.suggestions?.[0]?.data?.geo_lon

  const findRegion = regionsRus.find((it) => {
    return it.EN === needRegionsForBase
  })

  const regionBase = client.db(process.env.MONGO_COLLECTION)
  const dc = regionBase.collection(`${findRegion?.EN}_photo`)
  const dcHouse = await dc.findOne({name: {$regex: `${street}`, $options: "$i"}, 'parents.name': `${city}`, short_name: {$regex: `${houseNumber}`, $options: "$i"}})

  const rooms = (area) => {
    if (area <= 35) {
      return 1
    }
    if (area > 35 && area <= 55) {
      return 2
    }
    if (area > 55 && area <= 70) {
      return 3
    }
    else {
      return 4
    }
  }


    if (dcHouse) {
      const searchRegionGuid = dcHouse?.parents.find((it) => {
        if (it.kind === 'province') {
          return it
        }
      })
      const regionGuid = searchRegionGuid?.guid
      const houseGuid = dcHouse?.guid

      const url = `https://liquidator-proxy.domclick.ru/api/v4/pricepredict?rooms=${rooms(areaValue)}&comm_sq=${areaValue}&guid=${houseGuid}`
      const encodeUrl = encodeURI(url)
      const askPrice = await axios({
        headers: {
          'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoicHJlZHMiLCJzIjoiY2FsYy1mcm9udCJ9.LNjGQxSrx3HT3KbjvPBLpOQhHZd-HKRyfU1QKkJC1Oo',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'GET',
        timeout: 1000 * 15,
        url: encodeUrl
      })

      return res.json({data: askPrice.data.answer, regionGuid})
    }

    try {
      const askGeoHash = await axios({
        method: 'POST',
        timeout: 1000 * 15,
        url: 'https://www.avito.ru/js/v2/geo/position',
        data: {
          'address': address,
          'categoryId': 24,
          'latitude': lat,
          'longitude': lon
        }
      })
      const geoHash = askGeoHash?.data?.geoFieldsHash
      const askAboutPrice = await axios({
        headers: {
          'Host': 'www.avito.ru',
        },
        method: 'POST',
        timeout: 1000 * 15,
        url: 'https://www.avito.ru/web/1/realty-imv/get-data',
        data: {
          'geoHash':geoHash,
          'floor':3,
          'floorAtHome':5,
          'rooms':rooms(areaValue),
          'area':areaValue,
          'houseType':'panel',
          'renovationType':'euro',
          'hasLoggia':true
        }
      })

      return res.json(askAboutPrice?.data)
    } catch {
      return res.json('error')
    }
}
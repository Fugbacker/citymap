import axios from "axios"
import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function tooltips(req, res) {
const dadata = req.body
const kladrObjectCode = dadata?.settlement_kladr_id || dadata?.city_kladr_id
const kladrCode = parseInt(kladrObjectCode)
const region = dadata?.region_with_type
const settlementName = dadata?.settlement || null
const city = dadata?.city || null
const street = dadata?.street || null
const house = dadata?.house || null
const block = dadata?.block || null
const flat = dadata?.flat || null

  try {
    async function tryFindFlatList(regionId) {
      // const ReestrUrl = `https://rosreestr.gov.ru/fir_rest/api/fir/address/fir_objects?macroRegionId=${regionId}&street=${street}&house=${houseNumber}&building=${block}`
      let ReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${regionId}&street=${street}&house=${house}$&building=${block}&apartment=${flat}}`
      if (!block && !flat) {
        ReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${regionId}&street=${street}&house=${house}}`
      }
      const flatList = await axios({
        rejectUnauthorized: false,
        method: 'GET',
        timeout: 1000 * 15,
        url: encodeURI(ReestrUrl),
      })
      if (Array.isArray(flatList.data)) {
        return res.json(flatList.data)
      }
      return res.json([])
    }
      //Если регион - Москва
    if (kladrCode === 7700000000000) {
      const region = 145000000000
      tryFindFlatList(region)
    }
    //Если регион - Питер
    if (kladrCode === 7800000000000) {
      const region = 140000000000
      tryFindFlatList(region)
    }
    // Любой другой регион
    await client.connect()
    const db = client.db(process.env.MONGO_COLLECTION)
    const collection = db.collection('Reestr_geo')
    let settlement = await collection.findOne({ $and:[{settlement_code: kladrCode}, {settlement_name: settlementName || city}]})
    if (!settlement) {
      const settlement1 = await collection.findOne({ $and:[{settlement_code: kladrCode}, {settlement_name: settlementName?.toUpperCase() || city?.toUpperCase()}]})
      settlement = settlement1
    }

    const macroRegionId = settlement?.macroRegionId
    const regionId = settlement?.regionId
    // const askReestrUrl = `https://rosreestr.gov.ru/fir_rest/api/fir/address/fir_objects?macroRegionId=${macroRegionId}&regionId=${regionId}&street=${street}&house=${houseNumber}&building=${block}`
    let askReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${macroRegionId}&regionId=${regionId}&street=${street}&house=${house}&building=${block}&apartment=${flat}`
    if (!block && !flat) {
      askReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${macroRegionId}&regionId=${regionId}&street=${street}&house=${house}`
    }

    const flatList = await axios({
      rejectUnauthorized: false,
      method: 'GET',
      timeout: 1000 * 15,
      url: encodeURI(askReestrUrl),
    })
    if (Array.isArray(flatList.data)) {
      return res.json(flatList.data)
    }
    return res.json([])
  } catch {
    ((e) => console.log('ERROR_TOOLTIPS', e.status))
    return res.json([])
  }
}

import axios from "axios"

export default async function inn(req, res) {
  const arrayOfgeo = req.body
  let array = []
  await Promise.all(arrayOfgeo.map(async (it) => {
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=f0cdbfca-58dd-4461-a61e-844a4939a303&geocode=${it[0]},${it[1]}&format=json`
    const geocoding = await axios(url)
    const geocodingData = geocoding.data?.response?.GeoObjectCollection?.featureMember[0]?.GeoObject
    array = [...array, geocodingData]
  }))

  return res.json(array)
}
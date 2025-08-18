import React, { useEffect, useState } from 'react'
import { Link } from 'react-scroll'
import { MongoClient } from 'mongodb'
import axios from 'axios'
import Countdown from '../../countdown'
import Meta from '../../meta'
import { useRouter } from 'next/router'
import regions from '../regions'
import regionsRus from '../rusRegions'
import Header from '../../header'
import Footer from '../../footer'
import MenuLeft from '../../menu-left'
import Breadcrumbs from '../../breadcrumbs'
import Search from '../../search'
import Scroll from '../../scroll'
import Cadastr from '../../info-cadastr'
import Owners from '../../info-owners'
import Price from './info-price'
import Restriction from '../../info-restrictions'
import Jkh from '../../info-jkh'
import MkdAllFlats from '../../mkdAllFlats'
import MkdList from '../../mkdList'
import RandomMkdObjects from '../../randomMkdObjects'
import DadataCompany from '../../dadataCompany'
import Dadata from '../../dadata'
import MkdReestr from '../../mkd-reestr'
import PulseLoader from "react-spinners/PulseLoader";
import MkdMap from '../../mkdMap'
import Carusel from '../../carusel'
import MkdRating from '../../mkdRating'
import ReactLoading from 'react-loading'
import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';
// import Carusel from '../../Components/carusel'

// const DynamicMap = dynamic(
//   () => import('../../Components/mkdMap'),
//   { ssr: false }
// )

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default function Object(props) {
  // { cadastralObject, jkh, flatList,  number, mkdList, street, mkdObject, dcHouse}
  const [value, setValue] = useState('')
  const [chartValue, setChartValue] = useState('')
  const [loader, setLoader] = useState(true)
  // const [check, setCheck] = useState(false)
  const router = useRouter()
  const path = router?.asPath
  const dc = props.dcHouse && JSON.parse(props.dcHouse)
  // const fullRating = dc?.house_feedback?.total_rating
  const photoCheck = dc?.house_photos?.length
  const houseFeedBackCheck= dc?.house_feedback?.ratings.length
  const flats =  props.flatList && JSON.parse(props.flatList)
  const jkhObj =  props.jkh ? JSON.parse(props.jkh) : null
  const mkd = props.mkdObject ? JSON.parse(props.mkdObject) : null
  let cadNumber = router.query.cadnumber
  const cadastr = props.cadastralObject ? JSON.parse(props.cadastralObject) : null
  const objectName = cadastr?.objectData?.objectName
  const object = cadastr?.objectData?.objectName || 'Объект'
  const maxFloor = cadastr?.price?.bld?.maxFloor || value?.bld?.maxFloor || mkd?.floor_count_max
  const wallMaterial = cadastr?.price?.bld?.wallMaterial ||  value?.bld?.wallMaterial || mkd?.wall_material
  const price = cadastr?.price?.stats?.price || value?.market_price || value
  const livingCount = cadastr?.price?.bld?.livingCount || value?.bld?.livingCount || mkd?.living_quarters_count
  const rights = cadastr?.rights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)
  const encumbrances = cadastr?.rights?.realty?.encumbrances
  const encumbrancesCheck = encumbrances?.filter((it) =>  it?.encmbState === 1)
  const stats = value?.price?.stats || value?.stats
  const bldYear = value?.price?.bld?.bldYear || value?.bld?.bldYear || mkd?.built_year || mkd?.exploitation_start_year
  const bldTitle = value?.price?.bld?.bldTitle || value?.bld?.bldTitle
  const addressNotes = cadastr?.objectData?.objectAddress?.addressNotes || cadastr?.objectData?.objectAddress?.mergedAddress
  const appartment = cadastr?.objectData?.objectAddress?.apartment
  const lat = mkd?.lat || cadastr?.dadata?.geo_lat
  const houseGuid = mkd?.houseguid
  const region = mkd?.region_id

  const flor = (fl) => {
    if (fl >= 5 && fl <=20) {return 'этажей'}
    const regexp = /1$/g
    const checker = regexp.test(fl)
    if (checker) {return 'этаж'}
    const regexp2 = /2$|3$|4$/g
    const checker2 = regexp2.test(fl)
    if (checker2) {return 'этажа'}
    return 'этажей'
  }

  const askAboutPrice = async () => {
  const houseGuid = dc?.guid
  const searchRegionGuid = dc?.parents.find((it) => {
    if (it.kind === 'province') {
      return it
    }
  })
  const regionGuid = searchRegionGuid.guid
  const areaValue = cadastr?.parcelData?.areaValue || cadastr?.rights?.realty?.areaSize
  const adressUrl = `/api/price?comm_sq=${areaValue}&guid=${houseGuid}`
  const price = await axios(adressUrl)
  const marketPrice = price?.data?.market_price
  if (marketPrice && regionGuid) {
    const chartUrl = `/api/chart?comm_sq=${areaValue}&regionGuid=${regionGuid}&marketPrice=${marketPrice}`
    const chart = await axios(chartUrl)
    setChartValue(chart.data.flat_points)
    setLoader(true)
    setValue(price.data)
  }

  setLoader(true)
  setValue(price.data)
 }

 const ogDescrition =`${object} с кадастровым номером ${cadNumber}, адрес ${addressNotes} - онлайн проверка на наличие обременений, ограничений, ипотеки и информация об объекте недвижимости.`


  return (
    props ? (
      <>
      <Meta
        title={`${addressNotes} - ${object} на карте, проверка недвижимости и собственника перед покупкой на юридическую чистоту|${object} ${cadNumber} - кадастровые и технические сведения об объекте недвижимости: ${addressNotes}`}
        descritoin={`${object} с кадастровым номером ${cadNumber}, адрес ${addressNotes} - онлайн проверка на наличие обременений, ограничений, ипотеки и информация об объекте недвижимости.`}
        keywords={`${object} с кадастровым номером ${cadNumber}, адрес:${addressNotes} - проверка недвижимости и собственника перед покупкой на юридическую чистоту.`}
        canonicalURL={`https://mkdfond.ru${path}`}
        robots='index, follow'
        ogUrl={`https://mkdfond.ru${path}`}
        ogTitle={`${addressNotes} - ${object} на карте, проверка недвижимости и собственника перед покупкой на юридическую чистоту|${object} ${cadNumber} - кадастровые и технические сведения об объекте недвижимости: ${addressNotes}`}
        ogDescrition={`${object} с кадастровым номером ${cadNumber}, адрес ${addressNotes} - онлайн проверка на наличие обременений, ограничений, ипотеки и информация об объекте недвижимости.`}
        twitterTitle={`${addressNotes} - ${object} на карте, проверка недвижимости и собственника перед покупкой на юридическую чистоту|${object} ${cadNumber} - кадастровые и технические сведения об объекте недвижимости: ${addressNotes}`}
        twitterDescription={`${object} с кадастровым номером ${cadNumber}, адрес ${addressNotes} - онлайн проверка на наличие обременений, ограничений, ипотеки и информация об объекте недвижимости.`}
      />
      <div className="first">
        <Header />
        <section content-main="">
          <div className="object">
            <div className="mainCadastr">
              <div className="content">
                <Breadcrumbs cadastrObj={props.cadastralObject}/>
                <div className="tabs">
                  <input id="tab1" type="radio" name="tabs"  value="Общий Поиск" defaultChecked={true} />
                  <label htmlFor="tab1" title="Поиск любых объектов недвижимости по адресу или кадастровому номеру">Общий Поиск</label>

                  <input id="tab2" type="radio" name="tabs" value="Поиск в реестре МКД" />
                  <label htmlFor="tab2" title="Поиск многоквартирных домов в реестре МКД">Поиск в реестре МКД</label>

                  <input id="tab3" type="radio" name="tabs" value="Поиск в реестре ЖКХ" />
                  <label htmlFor="tab3" title="Поиск управляющих компаний в реестре ЖКХ">Поиск в реестре ЖКХ</label>

                  <section id="content-tab1">
                    <Search />
                  </section>
                  <section id="content-tab2">
                    <Dadata />
                  </section>
                  <section id="content-tab3">
                    <DadataCompany />
                  </section>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="object__wrap">
                <div className="object__contentWrap">
                  <div className="object__content">
                    <div className="house__short">
                      <h1>{ objectName ? (`${objectName} ${cadNumber}`) : (`Объект недвижимости ${cadNumber}`)}</h1>
                      <div className="houseDescription">
                        <p>{appartment && objectName && (`${objectName} с кадастровым номером ${cadNumber}`)}</p>
                        <div className="mkdLinkInfo">
                          <a href={`/mkd/${region}-mkd-${houseGuid}`}>
                            Посмотреть информацию о доме
                          </a>
                        </div>
                      </div>
                      <div className="house__shortAddress">{addressNotes}</div>
                      <div className="house__shortItems">
                        {wallMaterial && <div className="shortItem home">{wallMaterial}</div>}
                        {maxFloor && <div className="shortItem floor">{maxFloor && `${maxFloor} ${flor(maxFloor)}`}</div>}
                        {bldYear && <div className="shortItem year">{bldYear} год</div>}
                        {livingCount &&
                        <div className="shortItem flate">
                          <Link to="mkd-All-Flats" smooth="true" activeClass="active" spy={true} duration={500}>{livingCount} квартир</Link>
                        </div>}
                        {value && (value === 'Не смогли определить цену' ? (<div className="shortItem noPrice">Цена не определена</div>) : (
                          <Link to="price-info" smooth="true" activeClass="active" spy={true} duration={500}><div className="shortItem price" key={router.asPath}>{price} млн рублей</div></Link>
                        ))}
                        {!price && appartment && dc && (
                          <button
                            className="askPrice"
                            onClick={() => {
                              askAboutPrice()
                              setLoader(false)
                            }}
                          >
                            {!loader ? (
                              <div className="pulseLoader">
                                <PulseLoader color="#48a728" size={10} />
                              </div>
                            ) : (
                              <div className="flatPrice">Оценить</div>
                            )}
                          </button>
                        )}
                      </div>
                      {value && (value === 'Не смогли определить цену' ? (
                        <div className="houseDescription">
                          <p className='noPriceText'>Сервис не смог оценить рыночную стоимость квартиры, так как недостаточно статистических данных по продажам аналогичных объектов</p>
                        </div>
                        ) : (''))}
                    </div>
                    {/* <div className="menuLeft"></div> */}
                    {/* <MenuLeft cadastrObj={props.cadastralObject} price={value} jkhObj={props.jkh || null} mkdObject={props.mkdObject} dcHouse={props.dcHouse}/> */}
                    <MenuLeft cadastrObj={props.cadastralObject} price={value} mkdObject={props.mkdObject}/>
                    {/* <div className="menuLeftMobile"><MobileNavigationObject /></div> */}
                    {photoCheck > 0 && <Carusel dcHouse={props.dcHouse}/>}
                    {/* <Carusel data={testItems}/> */}
                    {/* <InfoMainObject cadastrObj={cadastralObject} /> */}
                    <Cadastr cadastrObj={props.cadastralObject} />
                    {rights && rightsCheck.length !== 0 && <Owners cadastrObj={props.cadastralObject} />}
                    {encumbrances && encumbrancesCheck.length !== 0 && <Restriction cadastrObj={props.cadastralObject} />}
                    {appartment && mkd &&(
                      <>
                        {value?.market_price  && <Price price={value} obj={props.cadastralObject} chart={chartValue}/>}
                        {/* {(bldYear || bldTitle) && <MkdReestr mkdObj={props.mkdObject} ogDescrition={ogDescrition}/>}
                        {houseFeedBackCheck > 0 && <MkdRating dcHouse={props.dcHouse}/>}
                        {props.jkh && <Jkh jkhObj={props.jkh} />} */}
                        {lat && <MkdMap obj={props.cadastralObject} mkd={props.mkdObject}/>}
                      </>
                    )}
                      {flats && flats.length !==0 && <MkdAllFlats flats={props.flatList} number={props.number} mkd={props.cadastralObject}/>}
                      {props.mkdList && <MkdList mkdList={props.mkdList} street={props.street} />}
                      <RandomMkdObjects />
                    <Scroll />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
   ): (
    <div className="spinnerContainer">
      <div className="spinner">
        <ReactLoading type="spinningBubbles" color="white" height={50} width={50} />
        <span>
          <Countdown />
        </span>
      </div>
    </div>
    )
  )
}

export async function getServerSideProps(context) {
  // try {
    const cadastr = context.params.cadnumber
    const getAskReestrByCudNum = await axios.get(`https://mkdfond.ru/api/findobject?cadNumber=${cadastr}`)
      if (!getAskReestrByCudNum.data.error) {
        const askObjectId = await axios(`https://mkdfond.ru/api/findId?cadNumber=${cadastr}`)
        const objectId = askObjectId?.data?.getAskId
        if (objectId !== 0 || objectId.error) {
          await axios(`https://mkdfond.ru/api/findRights?objectid=${objectId}&cadNumber=${cadastr}`)
        }
        const address =  getAskReestrByCudNum.data.objectData?.objectAddress?.addressNotes || getAskReestrByCudNum.data.objectData?.objectAddress?.mergedAddress

        if (address) {
          await axios(`https://mkdfond.ru/api/askdadata?cadNumber=${cadastr}`)
        }
        await client.connect()
      const db = client.db(process.env.MONGO_COLLECTION)
      const collection = db.collection('searchingObjects')
      const res = await collection.find({ $or : [{'objectData.objectCn': cadastr}, {'objectData.id':cadastr}]}).toArray()
      const cadastrObj = res[0]

      if (!cadastrObj) {
        return {
          notFound: true
        }
      }

      const searchAdress = cadastrObj?.objectData?.objectAddress?.addressNotes || cadastrObj?.objectData?.objectAddress?.mergedAddress
      // const searchFlat = cadastrObj?.dadata?.flat_type

      if (searchAdress) {

        const regionFiasCode = cadastrObj.dadata?.region_fias_id
        const houseFiasCode = cadastrObj.dadata?.house_fias_id

        const needRegionsForBase = regions[regionFiasCode]
        const regionBase = client.db(process.env.MONGO_COLLECTION)
        const regionCollection = regionBase.collection(`${needRegionsForBase}`)

        let findBuildingFromBase = await regionCollection.find({houseguid: houseFiasCode}).toArray()
        console.log('1ПОПЫТКА', findBuildingFromBase.length)
        if (findBuildingFromBase.length === 0) {
          const streetFiasCode = cadastrObj?.dadata?.street_fias_id
          const houseNumber = cadastrObj.dadata?.house
          const secondTry = await regionCollection.find({street_id: streetFiasCode, house_number: houseNumber}).toArray()
          console.log('2ПОПЫТКА', secondTry.length)
          if (secondTry.length === 0 && findBuildingFromBase.length === 0)  {
            const thirdTry = await regionCollection.find({street_id: streetFiasCode, house_number: houseNumber?.toLowerCase()}).toArray()
            console.log('3ПОПЫТКА', thirdTry.length)
            if (thirdTry.length === 0 && secondTry.length === 0 && findBuildingFromBase.length === 0) {
              const fouthTry = await regionCollection.find({street_id: streetFiasCode, house_number: houseNumber?.toUpperCase()}).toArray()
              console.log('4ПОПЫТКА', fouthTry.length)
              findBuildingFromBase = fouthTry
            }
            findBuildingFromBase = thirdTry
          }
        findBuildingFromBase = secondTry
        }

        const jkhCompanyId = findBuildingFromBase?.[0]?.management_organization_id
        const jkhBase = regionBase.collection('JKHBase')
        const company = await jkhBase.find({id: jkhCompanyId}).toArray()
        const companyJkh = company?.[0]
        const mkd = findBuildingFromBase?.[0]
        const houseNumber = mkd?.house_number.replace(/\s/g, '')
        const building = mkd?.building
        const block = mkd?.block
        const letter = mkd?.letter

        const streetData = {
          shortname: mkd?.shortname_street || null,
          formalName: mkd?.formalname_street || null,
        }

        // делаем запрос в Рорсеестр чтобы получить квартиры МКД
        if (mkd?.formalname_street && mkd) {
          const allMkdByStreet = await regionCollection.find({street_id: mkd.street_id}).toArray()
          // ищем КЛАДР коды в базе, чтобы потом сформировать ссылку для поиска квартир в Росреестре
          const kladrObjectCode = cadastrObj.dadata?.settlement_kladr_id || cadastrObj.dadata?.city_kladr_id || cadastrObj.dadata?.city_kladr_id
          const kladrCode = parseInt(kladrObjectCode)
          const streetSplit = (mkd?.formalname_street).split('.')
          const street = streetSplit.pop().trim()
          const city = mkd?.formalname_city

          // Паралельно ищем дом в базе ДЦ

          const findRegion = regionsRus.find((it) => {
            return it.EN === needRegionsForBase
          })
          const dc = regionBase.collection(`${findRegion.EN}_photo`)
          const dcHouseArray = await dc.find({name: {$regex: `${street}`, $options: "$i"}, 'parents.name': `${city}`, short_name: {$regex: `${houseNumber}`, $options: "$i"}}).toArray()
          let dcHouse = dcHouseArray[0]

          if (dcHouse?.length > 1) {
            dcHouseArray.filter((it) => {
              const splitAddres = it.name.split(',')
              const house = splitAddres[1].trim()

              if (house.length === houseNumber.length) {
                dcHouse = it
                return dcHouse
              }

            })
          }

          async function tryFindFlatList(regionId) {
            const ReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${regionId}&street=${street}&house=${houseNumber}&building=${block}`
            console.log('ЗАПРШИВАЕМЫЙ УРЛ', ReestrUrl)
            const flatList = await axios(encodeURI(ReestrUrl))
            if (flatList.data.length !== 0) {
              return {
                props: {mkdObject: JSON.stringify(mkd), jkh: JSON.stringify(companyJkh) || null, flatList: JSON.stringify(flatList.data) || null, number: houseNumber || null, mkdList: JSON.stringify(allMkdByStreet) || null, street: JSON.stringify(streetData) || null, dcHouse:JSON.stringify(dcHouse) || null }
              }
            }
            return {
              props: {mkdObject: JSON.stringify(mkd), jkh: JSON.stringify(companyJkh) || null, number: houseNumber || null, mkdList: JSON.stringify(allMkdByStreet) || null, street: JSON.stringify(streetData) || null, dcHouse:JSON.stringify(dcHouse) || null}
            }
          }

          //Если КЛАДР регион - Москва
          if (kladrCode === 7700000000000) {
            const region = 145000000000
            tryFindFlatList(region)
          }

          //Если КЛАДР регион - Питер
          else if (kladrCode === 7800000000000) {
            const region = 140000000000
            tryFindFlatList(region)
          }

          else {
            const findSettlement = regionBase.collection('Reestr_geo')
            const settlement = await findSettlement.find({settlement_code: kladrCode}).toArray()
            const dataOfObject = settlement[0]
            const macroRegionId = dataOfObject?.macroRegionId
            const regionId = dataOfObject?.regionId

            // делаем запрос в Рорсеестр чтобы получить квартиры МКД

            const askReestrUrl = `https://rosreestr.gov.ru/fir_lite_rest/api/gkn/address/fir_objects?macroRegionId=${macroRegionId}&regionId=${regionId}&street=${street}&house=${houseNumber}&building=${building}&structure=${block}`
            console.log('ЗАПРШИВАЕМЫЙ УРЛ', askReestrUrl)
            const flatList = await axios(encodeURI(askReestrUrl))
              return {
                props: {cadastralObject: JSON.stringify(cadastrObj) || null, jkh: JSON.stringify(companyJkh) || null, flatList: JSON.stringify(flatList.data) || null, number: houseNumber, mkdList: JSON.stringify(allMkdByStreet) || null, street: JSON.stringify(streetData) || null, mkdObject: JSON.stringify(mkd) || null, dcHouse:JSON.stringify(dcHouse) || null}
              }
          }
        }
        return {
          props: {cadastralObject: JSON.stringify(cadastrObj) || null, jkh: JSON.stringify(companyJkh) || null, mkdObject: JSON.stringify(mkd) || null}
        }
      }

    return {
        props: {cadastralObject: JSON.stringify(cadastrObj)}
      }
  } else {
    return {
      notFound: true
    }
  }
  // }
  // catch {
  //   return {
  //     notFound: true
  //   }
  // }
}


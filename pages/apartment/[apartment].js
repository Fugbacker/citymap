import React, { useState } from 'react'
import { Link } from 'react-scroll'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { MongoClient } from 'mongodb'
import Meta from '@/Components/meta'
import regions from '@/Components/files/regions'
import regionsRus from '@/Components/files/rusRegions'
import { Search } from '@/Components/search'
import Breadcrumbs from '@/Components/breadcrumbs'
import { Header } from '@/Components/header'
import { Footer } from '@/Components/footer'
import MkdReestr from '@/Components/mkd-reestr'
import MkdAllFlats from '@/Components/mkdAllFlats'
import Scroll from '@/Components/scroll'
import MkdList from '@/Components/mkdList'
import Carusel from '@/Components/carusel'
import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';
import ShareButtons from '@/Components/shareButtons'
import EgrnBanner from '@/Components/egrnBanner'
import SeoLinks from '@/Components/seoLinks'
import style from'../../styles/File.module.css'
import macroRegions from '@/Components/files/macroRegions'


// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const url = process.env.MONGO_URL;
const client = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true })
const clientPromise = client.connect()

async function getDatabase() {
  await clientPromise; // Убедитесь, что подключение завершено
  return client.db(process.env.MONGO_COLLECTION);
}


const DynamicMkdMap = dynamic(
  () => import('../../Components/mkdMap'),
  { ssr: true }
)


// const url = process.env.MONGO_URL
// const client = new MongoClient(url, { useUnifiedTopology: true })

export default function Object({mkd, jkh, number, mkdList, street, dcHouse, repair}) {
  const [cadastrData, setCadastrData] = useState([])
  const [type, setType] = useState('')
  const [checkFlats, setCheckFlats] = useState(false)
  const colorStarRating = (rating) => {
    if ( rating < 3 ) { return <StarRateRoundedIcon className={style.redStar} fontSize="medium"/> }
    if ( rating >= 3 && rating < 4) { return <StarRateRoundedIcon className={style.yellowStar} fontSize="medium"/> }
    if ( rating >= 4 ) { return <StarRateRoundedIcon className={style.greenStar} fontSize="medium"/> }
  }



  const router = useRouter()
  const path = router?.asPath
  const repairInfo = repair && JSON.parse(repair)
  const dc = dcHouse && JSON.parse(dcHouse)
  const fullRating = dc?.house_feedback?.total_rating
  const photoCheck = dc?.house_photos?.length
  const houseFeedBackCheck= dc?.house_feedback?.ratings.length
  const organization = jkh && JSON.parse(jkh)
  const jkhName = organization?.name_short
  const mkdHouse = mkd && JSON.parse(mkd)
  const maxFloor = mkdHouse?.floor_count_max
  const builtYear = mkdHouse?.built_year
  const flatsArray = mkdHouse?.flatList
  const houseNumber = (number + '||').toUpperCase()
  const allCount = mkdHouse?.quarters_count
  const bldYear = mkdHouse?.exploitation_start_year
  const houseArea = mkdHouse?.area_total
  const addressMkd = mkdHouse?.address
  const okato = mkdHouse?.okato
  const oktmo = mkdHouse?.oktmo
  const lat = mkdHouse?.lat

  const livingCountChecker = flatsArray && (flatsArray?.filter((it) => {
    return it.apartment
  }).length)


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

  const ogDescrition = `Реестр квартир многоквартирного дома ${addressMkd} - кадастровые актуальные сведения по квартирам: обременения, залоги, аресты. Технические и кадастровые сведения о мноквартирном доме ${addressMkd}`
  return (
    <>
      <Meta
        title={`Кадастровый технический паспорт многоквартирного дома - ${addressMkd} | Кадастровый реестр 1-комнатных, 2-комнатных, 3-комнатных квартир для аренды и покупки`}
        descritoin={`Реестр квартир многоквартирного дома ${addressMkd} - кадастровые актуальные сведения по квартирам: обременения, залоги, аресты. Технические и кадастровые сведения о мноквартирном доме ${addressMkd}`}
        keywords={`Кадастровый реестр квартир (жилых помещений) многоквартирного дома - ${addressMkd}, кадастровый паспорт мкд ${addressMkd}, технический паспорт мкд ${addressMkd}`}
        canonicalURL={`https://cadmap.su.ru${path}`}
        robots='index, follow'
        ogUrl={`https://cadmap.su${path}`}
        ogTitle={`Кадастровый технический паспорт многоквартирного дома - ${addressMkd} | Кадастровый реестр 1-комнатных, 2-комнатных, 3-комнатных квартир для аренды и покупки`}
        ogDescrition={ogDescrition}
        twitterTitle={`Кадастровый технический паспорт многоквартирного дома - ${addressMkd} | Кадастровый реестр 1-комнатных, 2-комнатных, 3-комнатных квартир для аренды и покупки`}
        twitterDescription={`Реестр квартир многоквартирного дома ${addressMkd} - кадастровые актуальные сведения по квартирам: обременения, залоги, аресты. Технические и кадастровые сведения о мноквартирном доме ${addressMkd}`}
      />
      <div className={style.first}>
        <Header />
        <section content-main="">
          <div className={style.object}>
            <div className={style.content1}>
              <Breadcrumbs cadastrObj={mkd}/>
              <Search setType={setType} cadastrData={cadastrData} setCadastrData={setCadastrData}/>
            </div>
          {cadastrData.length === 0 &&
            <div className={style.content1}>
            <div className={style.object__wrap}>
            <ShareButtons ogDescrition={ogDescrition}/>
              <div className={style.object__contentWrap}>
                <div className={style.object__content}>
                  <div className={style.object__block}>
                    <div className={style["object__block-wrap"]}>
                      <div className={style.adfinixBlock}>
                        <div class="adfinity_block_13133"></div>
                      </div>
                    </div>
                  </div>
                  <div className={style.house__short}>
                    <h1>
                    <Link href="/spravochnaya_informaciya" title={`справочная информация по объектам недвижимости в режиме online`}>
                      Справочная информация по объекту недвижимости в режиме онлайн: {mkdHouse?.shortname_street || mkdHouse?.shortname_city}. {mkdHouse?.formalname_street || mkdHouse?.formalname_city}, {mkdHouse?.house_number}{mkdHouse?.letter ? (`, лит. ${mkdHouse?.letter}`):('')}
                      </Link>
                    </h1>
                    <div className={style.houseDescription}>
                      <p>
                        {maxFloor && (`Многоквартирный (МКД) жилой ${maxFloor} этажный дом.`)} {(builtYear || bldYear) && (`Год постройки: ${builtYear || bldYear}г. Год ввода в эксплуатацию: ${bldYear}г. `)}
                        {houseArea && (`Согласно техническим сведениям, общая площадь мкд составляет ${houseArea} кв.м и включает в себя ${allCount} жилых и не жилых помещений.`)} {jkhName && (`МКД находится под управлением ${jkhName}.`)}
                      </p>
                    </div>
                    <div className={style.house__shortAddress}>{addressMkd}</div>
                    <div className={style.house__shortItems}>
                      {mkdHouse?.is_alarm === 'Нет'
                        ? <div className={`${style.shortItem} ${style.goodHouse}`}>Не аварийный</div>
                        : <div className={`${style.shortItem} ${style.badHouse}`}>Аварийный</div>
                      }
                      {mkdHouse?.energy_efficiency && <div className={`${style.shortItem} ${style.efficiency}`}>класс {mkdHouse?.energy_efficiency}</div>}
                      {maxFloor && <div className={`${style.shortItem} ${style.floor}`}>{maxFloor && `${maxFloor} ${flor(maxFloor)}`}</div>}
                      {bldYear && <div className={`${style.shortItem} ${style.year}`}>{bldYear} год</div>}
                      {checkFlats && livingCountChecker &&
                      <div className={`${style.shortItem} ${style.flate}`}>
                        <Link to="mkd-All-Flats" smooth="true" activeClass="active" spy={true} duration={500}>{livingCountChecker} квартир <span className={style.checkFlats}>(проверить)</span></Link>
                      </div>}
                      {repairInfo?.total_ppl && <div className={`${style.shortItem} ${style.countMember}`}>{repairInfo.total_ppl} жильцов</div>}
                    </div>
                  </div>
                  {/* <MenuMkd  mkd={mkd} jkh={jkh} flatChecker={checkFlats} dcHouse={dcHouse} number={number} repair={repair} flatsCount={livingCountChecker}/> */}
                  {/* {checkFlats && <EgrnBanner />} */}
                  {photoCheck > 0 && <Carusel dcHouse={dcHouse}/>}
                  <div className={style.object__block}>
                    <div className={style["object__block-wrap"]}>
                      <div className={style.adfinixBlock}>
                        <div class="adfinity_block_13133"></div>
                      </div>
                    </div>
                  </div>
                  <MkdReestr mkdObj={mkd} jkhObj={jkh} />
                  <SeoLinks />
                  {/* {livingCountChecker && livingCountChecker.length !==0 && livingCountChecker !== NaN && <Banner mkd={mkd} />} */}
                  {lat && <DynamicMkdMap mkd={mkd} />}
                  {flatsArray && flatsArray.length !==0 && flatsArray !== NaN && livingCountChecker && <MkdAllFlats number={number} mkd={mkd} setCheckFlats={setCheckFlats}/>}
                  {mkdList && <MkdList mkdList={mkdList} street={street}/>}
                  {/* {flatsArray && flatsArray.length !==0 && flatsArray !== NaN && livingCountChecker && <FlatReestr flats={livingCountChecker} number={number} mkd={mkd}/>} */}
                  <Scroll />
                </div>
              </div>
            </div>
          </div>
          }
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}


export async function getServerSideProps(context) {
  try {
    // Получаем данные из URL
    const fiasNumbers = context.params.apartment;
    const splitNumbers = fiasNumbers.split('|');
    const regionFiasCode = splitNumbers[0];
    const houseId = parseInt(splitNumbers[1]);

    const regionBase = await getDatabase(); // Используем глобальное подключение
    const searchRegions = regions[regionFiasCode];
    const regionCollection = regionBase.collection(searchRegions);

    // Ищем мкд по фиас коду
    let mkd = await regionCollection.findOne({ id: houseId });
    const houseNumber = mkd?.house_number.replace(/^\./, '').trim();

    const streetData = {
      shortname: mkd?.shortname_street || null,
      formalName: mkd?.formalname_street || null,
    };

    // Если мкд не найден, возвращаем 404 ошибку
    if (!mkd) {
      const mkd1 = await regionCollection.findOne({ id: splitNumbers[1] });
      if (!mkd1) {
        return { notFound: true };
      }
      mkd = mkd1;
    }

    // Ищем сведения о капитальном ремонте
    const findRegion = regionsRus.find((it) => it.EN === searchRegions);

    // Ищем все дома на улице
    const allMkdByStreet = await regionCollection.find({ street_id: mkd.street_id }).toArray();
    const clearMkdList = allMkdByStreet.filter((elem, index, self) =>
      self.findIndex((t) => t.houseguid === elem.houseguid) === index
    );

    // Ищем фотки и доп инфу к дому
    const streetSplit = mkd?.formalname_street?.split('.');
    const streetName = streetSplit?.pop()?.trim();
    const city = mkd?.formalname_city;
    const dc = regionBase.collection(`${findRegion.EN}_photo`);
    const dcHouse = await dc.findOne({
      name: { $regex: `${streetName}`, $options: '$i' },
      'parents.name': city,
      short_name: { $regex: `${houseNumber}`, $options: '$i' },
    });

    return {
      props: {
        mkd: JSON.stringify(mkd),
        number: houseNumber || null,
        mkdList: JSON.stringify(clearMkdList) || null,
        street: JSON.stringify(streetData) || null,
        dcHouse: JSON.stringify(dcHouse) || null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}

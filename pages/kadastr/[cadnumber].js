import React, { useState, useEffect, useRef} from 'react'
import Link from 'next/link'
import QRCode from "react-qr-code"
import axios from 'axios'
import UserAgent from 'user-agents';
import Meta from '../../Components/meta'
import { useRouter } from 'next/router'
import { Search } from "@/Components/search"
import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import Cadastr from '@/Components/info-cadastr'
import Scroll from '@/Components/scroll'
import OwnersShot from '@/Components/ownersShot'
import Carusel from '@/Components/carusel'
import ShareButtons from '@/Components/shareButtons'
import CheckRaports from '@/Components/checkRaports'
import MkdMapLite from '@/Components/mkdMapLite'
import GeneratePdfButton from '@/Components/generatePdfButton'
import ExpressReportPDFGenerator from '@/Components/expressReportPDFGenerator'
import MkdForCadastr from '@/Components/mkdForCadastr'
import  { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from'../../styles/File.module.css'
import http from 'http';
import https from 'https';
import { getGeoportalUrls } from '@/libs/urls';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
let lastSuccessfulIndex = -1;

export default function Object(props) {
  const [ready, setReady] = useState(false)
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 10 минут в секундах
  const [stepTwoChecker, setTwoStepChecker] = useState(false)
  const [activate, setActivate] = useState(false)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [rightLoader, setRightLoader] = useState(true)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [cadastrData, setCadastrData] = useState([])
  // const [fullContent, setFullContent] = useState(false)
  // const [loading, setLoading] = useState(false);
  // const [closeChecker, setCloseChecker] = useState(false)
  // const [baloonData, setBaloonData] = useState('');
  // const [alarmMessage, setAlarmMessage] = useState(false)
  // const [cadastrNumber, setCadastrNumber] = useState('')
  const [noRigths, setNoRights] = useState(false)

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

  const ref = useRef(null)
  const { data: session } = useSession()

  const router = useRouter()
  const path = router?.asPath
  let cadNumber = router.query.cadnumber
  const cadastr = props.cadastralObject ? JSON.parse(props.cadastralObject) : null
  const dc = props?.dcHouse && JSON.parse(props.dcHouse)
  const photoCheck = dc?.house_photos?.length
  const dcCheck = dc?.house_info

  const objectName = cadastr?.objectData?.objectName || cadastr?.objectData?.objectDesc || cadastr?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadastr?.elements?.[0]?.objType)?.name || cadastr?.data?.features?.[0]?.properties?.options?.type || cadastr?.data?.features?.[0]?.properties?.options?.land_record_type || cadastr?.data?.features?.[1]?.properties?.options?.land_record_type || cadastr?.features?.[0]?.properties?.options?.params_type || cadastr?.features?.[0]?.properties?.options?.land_record_type || cadastr?.features?.[0]?.properties?.options?.building_name || 'Объект'

  // const object = cadastr?.objectData?.objectName || cadastr?.objectData?.objectDesc || cadastr?.result?.object?.objectType || realEstateCategories.find(item => item.code === cadastr?.elements?.[0]?.objType)?.name || 'Объект'
  const rights = flatRights?.rightsData?.realty?.rights || cadastr?.result?.object?.rights || cadastr?.objectData?.rights ||
  cadastr?.elements?.[0]?.rights

  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1) || cadastr?.elements?.[0]?.rights.length !== 0
  const encumbrances = flatRights?.rightsData?.realty?.encumbrances || cadastr?.elements?.[0]?.encumbrances
  const encumbrancesCheck =  cadastr?.result?.object?.restrictionsCount === 1 || cadastr?.elements?.[0]?.encumbrances.length !== 0 || encumbrances?.filter((it) =>  it?.encmbState === 1)

  const addressNotes = cadastr?.objectData?.objectAddress?.addressNotes || cadastr?.objectData?.objectAddress?.mergedAddress || cadastr.addressNotes || cadastr?.objectData?.address?.mergedAddress || cadastr.objectData?.objectAddress || cadastr?.result?.object?.address || cadastr?.elements?.[0]?.address?.readableAddress || cadastr?.data?.features?.[0]?.properties?.options?.readable_address || cadastr?.data?.features?.[1]?.properties?.options?.readable_address || cadastr?.features?.[0]?.properties?.options?.readable_address

  const areaType = cadastr?.parcelData?.areaType




  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])


  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setIsVisible(false);
    }
  }, [timeLeft]);


  const focus = () => {
    ref?.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    setTimeout(() => {
      focus()
    }, 50)
  }, [cadNumber])

  const getTextColor = () => {
    return timeLeft <= 60 && 'red';
  };

  <ToastContainer
    position="bottom-left"
    autoClose={1000}
    limit={1}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />

 const ogDescrition =`${objectName}: кадастровый номер ${cadNumber}, адрес ${addressNotes} - заказ выписок из ЕГРН для проверки объекта недвижимости на наличие арестов, обременений, залогов`

 useEffect(() => {
  setReady(false)
  setTimeout(() => {
    setReady(true)
  }, 1000)
}, [cadNumber])

  return (
      <>
      <Meta
        title={`Справочная кадастровая информация из Росреестра по объекту недвижимости расположенного по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
        descritoin={`${objectName} - справочные сведения из Росреестра по объекту недвижимости с кадастровым номером ${cadNumber}. Общедоступная справочная информация об объекте недвижимости по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
        keywords={`справочная информация по адресу ${addressNotes}, справочная кадастровая информация по кадастровому номеру ${cadNumber}, справочная росреестра по кадастровому номеру ${cadNumber}, справочная росреестра по адресу ${addressNotes}`}
        canonicalURL={`https://cadmap.su${path}`}
        robots='index, follow'
        ogUrl={`https://cadmap.su${path}`}
        ogTitle={`Справочная кадастровая информация из Росреестра по объекту недвижимости расположенного по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
        ogDescrition={`${objectName} - справочные сведения из Росреестра по объекту недвижимости с кадастровым номером ${cadNumber}. Общедоступная справочная информация об объекте недвижимости по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
        twitterTitle={`Справочная кадастровая информация из Росреестра по объекту недвижимости расположенного по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
        twitterDescription={`${objectName} - справочные сведения из Росреестра по объекту недвижимости с кадастровым номером ${cadNumber}. Общедоступная справочная информация об объекте недвижимости по адресу ${addressNotes} с кадастровым номером ${cadNumber}`}
      />
      <div className={style.first}>
        <Header />
        <section>
          <div className={style.object}>
            <div className={style.content}>
              {session && <GeneratePdfButton cadNumber={cadNumber}/>}
              {session && <ExpressReportPDFGenerator cadNumber={cadNumber}/>}
              <Search cadastrData={cadastrData} setCadastrData={setCadastrData}/>
            </div>
            {cadastrData.length === 0 &&
              <div className={style.content}>
              <div className={style.object__wrap}>
              <ShareButtons ogDescrition={ogDescrition}/>
                <div className={style.object__contentWrap}>
                  <div className={style.object__content}>
                    <div className={style.objectShortData} id="upTo" >
                    <h1 ref={ref}>
                      <Link href="/spravochnaya_informaciya" title={`справочная информация по объекту недвижимости в режиме online - ${cadNumber}`}>
                        {objectName ? (
                          `${objectName === '01' ? 'Справочная онлайн информация по объекту недвижимости:' : objectName} ${cadNumber}`
                        ) : (
                          `Справочная онлайн информация по объекту недвижимости: ${cadNumber}`
                        )}
                      </Link>
                    </h1>
                      <div className={style.reportDescritpion2}>
                      <div className={style.house__shortAddress}><Link href="/adres_po_kadastrovomu_nomeru" title="узнать кадастровый номер объекта недвижимости по адресу">{objectName ? (`${objectName === '01' ? 'Объект недвижимости' : objectName}`) : (`Объект недвижимости`)} - кадастровый номер {cadNumber} по адресу: {addressNotes}</Link></div>
                        <div className={style.qr}>
                          <QRCode size={50} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={`https://cadmap.su${path}`} />
                        </div>
                      </div>
                    </div>
                    {photoCheck > 0 && <Carusel dcHouse={props.dcHouse}/>}
                    <div className={style.cadastrContainer}>
                      <Cadastr cadastrObj={props?.cadastralObject} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} areaType={areaType} setIsVisible={setIsVisible} isVisible={isVisible} />
                      <OwnersShot cadastrObj={flatRights} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} areaType={areaType} setIsVisible={setIsVisible} isVisible={isVisible} rightsData={rights} encumbrancesChecker={encumbrancesCheck} encumbrancesData={encumbrances} noRigths={noRigths}/>
                    </div>
                    {dc ?
                      <div className={style.houseInfoContainer}>
                        <MkdForCadastr dcHouse={props.dcHouse}/>
                        <MkdMapLite dcHouse={dc}/>
                      </div>
                      :
                       dcCheck && <MkdMapLite dcHouse={dc}/>
                    }

                     {ready && <CheckRaports cadNum={cadNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} rightLoader={rightLoader} setRightLoader={setRightLoader} setIsVisible={setIsVisible} isVisible={isVisible} />}

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
    const referer = context.req.headers.referer;
    const cadNum = context.params.cadnumber.trim();

    const host = context.req.headers.host;
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;

    const response = await axios.get(`${baseUrl}/api/ips`);
    const ipsList = response.data;

    const geoportalUrls = getGeoportalUrls(cadNum);
    const userAgent = new UserAgent();

    const getRandomLocalIp = () =>
      ipsList[Math.floor(Math.random() * ipsList.length)];

    async function tryUrlsSequentially(startIndex, attemptsLeft) {
      if (attemptsLeft === 0) return null;

      const idx = startIndex % geoportalUrls.length;
      const url = geoportalUrls[idx];
      const localIp = getRandomLocalIp();

      try {
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
          keepAlive: true,
          localAddress: localIp,
        });

        const response = await axios.get(url, {
          httpsAgent,
          timeout: 4000,
          headers: {
            'User-Agent': userAgent.toString(),
          },
          httpAgent: new http.Agent({ localAddress: localIp }),
        });

        if (response?.data) {
          lastSuccessfulIndex = idx;
          return response.data;
        }

        return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
      } catch (e) {
        console.error(`Ошибка при запросе ${url}:`, e.message);
        return tryUrlsSequentially(idx + 1, attemptsLeft - 1);
      }
    }

    const startFrom = (lastSuccessfulIndex + 1) % geoportalUrls.length;
    const cadastrObj = await tryUrlsSequentially(startFrom, geoportalUrls.length);

    if (!cadastrObj) {
      return { notFound: true };
    }

    return {
      props: {
        cadastralObject: JSON.stringify(cadastrObj) || null,
        referer: JSON.stringify(referer) || null,
      }
    };
  } catch {
    return { notFound: true };
  }
}

import React, { useState, useEffect, useRef} from 'react'
import axios from 'axios'
import UserAgent from 'user-agents';
import QRCode from "react-qr-code"
import { MongoClient } from 'mongodb'
import regionNumbers from '../../Components/files/regionsNumbers'
import regionsRus from '../../Components/files/rusRegions'
import { useRouter } from 'next/router'
import InfoCadastrReport from '../../Components/infoCadastrReport'
import InfoOwnersReport from '../../Components/infoOwnersReport'
import InfoRestrictionsReport from '../../Components/infoRestrictionsReport'
// import { getServerSession } from "next-auth/next"
// import { authOptions } from 'pages/api/auth/[...nextauth]'
import CaruselReport from '../../Components/caruselReport'
import PpkMapLiteReport from '../../Components/ppkMapLiteReport'
import MkdMapLiteReport from '../../Components/mkdMapLiteReport'
import MkdForCadastrReport from '../../Components/mkdForCadastrReport'
import https from 'https';

const userAgent = new UserAgent()
const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default function Object({ cadastralObject, dcHouse }) {

  // const [loading, setLoading] = useState(false);
  const [closeChecker, setCloseChecker] = useState(false)
  const [baloonData, setBaloonData] = useState('');
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [cadastrNumber, setCadastrNumber] = useState('')
  const router = useRouter()
  const path = router?.asPath
  let cadNumber = router.query.justifycontentcenter
  const dc = dcHouse && JSON.parse(dcHouse)
  const cadastrObj = cadastralObject && JSON.parse(cadastralObject)
  console.log('cadastralObject', cadastrObj)
  const photoCheck = dc?.house_photos?.length
  const dcCheck = dc?.house_info
  const rights = cadastrObj?.realty?.rights || cadastrObj?.rights?.realty?.rights || cadastrObj?.rights || cadastrObj?.rightEncumbranceObjects || cadastrObj?.rights?.realty?.rights?.filter((it) => it?.rightState === 1) || cadastrObj?.result?.object?.rights || cadastrObj?.elements?.[0]?.rights
  // const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)

  const data = new Date()
  const year = data.getFullYear()
  const month = `0${data.getMonth()+1}`
  const monthReal = month.length > 2 ? month.slice(1) : month
  const day = data.getDate()
  const areaType = cadastrObj?.parcelData?.areaType
  return (
      <>
      <div className="first">
        <section>
          <div>
            <div style={{ width: '1100px', margin: '0 auto', position: 'relative' }} className='alabama'>
              <div style={{ position: 'relative', paddingBottom: '100px', width: '100%' }}>
              <h1 style={{ fontSize: '22px', marginBottom: '10px', textAlign: 'center' }}>{`Экспресс-отчет об объекте недвижимости ${cadNumber}`}</h1>
                <div style={{ display: 'block',  paddingTop: '30px', paddingBottom: '10px'}}>
                 <div style={{float: 'left', width: '90%'}}>
                  <div style={{fontSize: '13px', fontWeight: 700, color: '#8a95a2', position: 'relative', textAlign: 'justify', marginRight: '20px', marginBottom: '10px'}}>
                    Данный отчет не содержит подписи ЭЦП, носит исключительно информационный
                    характер, формируется на основе сведений, полученных из открытых источников, не
                    является юридическим документом, а также по форме и совокупности сведений не
                    соответствуют формам предоставления сведений из ЕГРН
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '12px', color: '#999', marginRight: '10px', position: 'relative', marginBottom: '40px'}}>{`Дата запроса:  ${day}.${monthReal}.${year}`}</div>
                </div>
                  <div style={{width: '10%', float:'right'}}>
                    <QRCode size={100} style={{ height: "auto", maxWidth: "75%", width: "75%" }} value={`https://rosreestr.gov.ru`}/>
                  </div>
                </div>

                  {photoCheck > 0 && <CaruselReport dcHouse={dcHouse}/>}
                  {/* {areaType === '009' && <PpkMapLiteReport cadastrNumber={cadNumber} setCloseChecker={setCloseChecker} closeChecker={closeChecker} setBaloonData={setBaloonData} baloonData={baloonData} setAlarmMessage={setAlarmMessage} alarmMessage={alarmMessage} setCadastrNumber={setCadastrNumber}   />} */}
                  {dcCheck && <MkdForCadastrReport dcHouse={dcHouse}/>}
                  {/* {dc && <MkdMapLiteReport dcHouse={dc}/>} */}
                  <InfoCadastrReport cadastrObj={cadastralObject}  />
                  {Array.isArray(rights) && rights.length !==0 && <InfoOwnersReport cadastrObj={cadastrObj} rightsData={rights} />}
                  <InfoRestrictionsReport cadastrObj={cadastrObj} />
              </div>
            </div>
          </div>
        </section>
      </div>

    </>
  )
}

export async function getServerSideProps(context) {

  // try {
      await client.connect()
      const db = client.db(process.env.MONGO_COLLECTION);
      const cadastr = context.params.justifycontentcenter
      const cadNum = cadastr.trim()

      const processCadastralNumber = (cadastralNumber) => {
        return cadastralNumber.split(':').map(block => {
          return block === '0' || /^0+$/.test(block) ? '0' : block.replace(/^0+/, '');
        }).join(':');
      };

      const fetchData = async (url) => {
        try {
          const { data } = await axios.get(encodeURI(url), { timeout: 10000 });
          return data;
        } catch {
          return null;
        }
      };


      const fetchPostData = async (url) => {
        try {
          const { data } = await axios({
            method: 'POST',
            url: encodeURI(url),
            headers: {
              'Host': 'domvisor.ru',
              'User-Agent': userAgent.toString(),
            },
            timeout: 10000,
            data: {
              "jsonrpc":"2.0",
              "id":1,
              "method":"egrn.byNumber",
              "params":{"number":`${cadNum}`}
            }
          });
          return data;
        } catch (e) {
          console.log('DOMVIZOR ERROR', e)
          return null;
        }
      }

      const fetchData1 = async (url) => {
        try {
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false, // НЕБЕЗОПАСНО, но если нужен самоподписанный сертификат — оставить
            keepAlive: true, // Сохраняем соединение дольше
            secureProtocol: 'TLSv1_2_method', // Явно указываем TLS 1.2
          });

          const { data } = await axios.get(url, {
            httpsAgent,
            timeout: 2000,
            headers: {
              'User-Agent': userAgent.toString(),
              'Host': 'nspd.gov.ru',
            },
          });

          return data;
        } catch (e) {
          return null;
        }
      };



      let cadastrObj = await fetchPostData(`https://domvisor.ru/api/rpc`);

      if (cadastrObj.length === 0 || !cadastrObj) {
        cadastrObj = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`);
      }

      if (!cadastrObj) {
        cadastrObj = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNum}`);
      }

      if (!cadastrObj) {
        cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`);
      }

      if (!cadastrObj) {
        cadastrObj = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNum}`);
      }


      if (!cadastrObj) {
        return { notFound: true };
      }



      const fiasCode = `1${cadNum.split(':')[0]}`;
      const readableAddress = cadastrObj?.data?.features?.[0]?.properties?.options?.readable_address || cadastrObj?.data?.features?.[1]?.properties?.options?.readable_address || cadastrObj?.result?.object?.address


      function parseAddress(address) {
        const parts = {
            region: null,
            district: null,
            locality: null,
            city: null,
            street: null,
            houseNumber: null,
        };

        // Разбиваем адрес на основные части
        const regionMatch = address.match(/^[^,]+/);
        if (regionMatch) parts.region = regionMatch[0].trim();

        const districtMatch = address.match(/р-н\.\s*([^,]+)/);
        if (districtMatch) parts.district = districtMatch[1].trim();

        // Извлечение города (г. или город)
        const cityMatch = address.match(/(?:г\.|город)\s*([^,]+)/);
        if (cityMatch) parts.city = cityMatch[1].trim();

        // Извлечение улицы (ул.)
        const streetMatch = address.match(/ул\s*\.\s*([^,]+)/);
        if (streetMatch) parts.street = streetMatch[1].trim();

        // Исправленное регулярное выражение для извлечения номера дома с буквой
        const houseMatch = address.match(/д\s*\.\s*([\d]+[а-яА-Я]?)\s*/);
        if (houseMatch) {
            parts.houseNumber = houseMatch[1].trim();
            // Убираем номер дома из адреса, чтобы он не попал в другие части
            address = address.replace(houseMatch[0], '').trim();
        }

        // Извлечение населенного пункта
        const localityMatch = address.match(/(?:с\/п\.|ст-ца\.|пос\.|д\.)\s*([^,]+)/);
        if (localityMatch) parts.locality = localityMatch[1].trim();

        return parts;
    }

      let address
      if (readableAddress) {
        address = parseAddress(readableAddress)
      }

      const regionBase = client.db(process.env.MONGO_COLLECTION)
      const regionFiasCode = cadastrObj.objectData?.regionKey || cadastrObj.regionKey || fiasCode
      let needRegionsForBase = regionNumbers[regionFiasCode];
      let city = cadastrObj?.objectData?.objectAddress?.place || address?.city;
      let street = cadastrObj?.objectData?.objectAddress?.street || address?.street;
      let houseNumber = cadastrObj?.objectData?.objectAddress?.house || address?.houseNumber;

      const findRegion = regionsRus.find((it) => {
        return it.EN === needRegionsForBase
      })

      const dc = regionBase.collection(`${findRegion?.EN}_photo`)

      const dcHouse = await dc.findOne({name: {$regex: `${street}`, $options: "$i"}, 'parents.name': `${city}`, short_name: {$regex: `${houseNumber}`, $options: "$i"}})

    return {
      props: {cadastralObject: JSON.stringify(cadastrObj) || null, dcHouse: JSON.stringify(dcHouse) || null}
    }

  // }
  // catch {
  //   return {
  //     notFound: true
  //   }
  // }
}


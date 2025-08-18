import { useState, useEffect } from 'react'
import axios from 'axios'
import CheckRaports from '@/Components/checkRaports'
import PpkMapWidget from '@/Components/ppkMapWidget'
import style from '../styles/File.module.css'

export default function Home({ country, lat, lon, referer }) {
  const [cadastrData, setCadastrData] = useState([])
  const [error, setError] = useState(false)
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [isVisible, setIsVisible] = useState(true);
  const [promoCode, setPromoCode] = useState('')
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('');
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)

  useEffect(() => {
    setCadastrData([])
  }, [closeChecker])

  useEffect(() => {
    setCadastrData([])
  }, [alarmMessage])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])


  useEffect(() => {
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])


  return (
    <>
      {alarmMessage &&
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
          <div className={style.repairBlock}>
            <div className={style["object__block-wrap"]}>
              <div className={style.repairInfo}>
                <p>Не удалось загрузить данные по объекту, серверы кадастровой карты перегружены. Попробуйте произвести поиск чуть позже.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
          <PpkMapWidget cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError}/>
    </>
  )
}


export async function getServerSideProps(context) {
  // let regionData = context.params.map
  const referer = context?.req?.headers?.referer?.split('/kadastr/')?.[1] || null

  const regexp = /\d+\:\d+\:\d+\:\d+/g
  // const checker = regexp.test(regionData)
  try {
    const userIp = await axios('https://kraken.rambler.ru/userip')
    const userGeolocation = await axios(`http://ip-api.com/json/${userIp.data}`)
    const country = userGeolocation?.data?.country

    if (country === 'Russia' && referer) {
      return {
        props: {
          country: userGeolocation?.data?.country,
          lat: userGeolocation?.data?.lat,
          lon: userGeolocation?.data?.lon,
          referer
        },
      }
    } else if (country === 'Russia' && !referer) {
      return {
        props: {
          country: userGeolocation?.data?.country,
          lat: userGeolocation?.data?.lat,
          lon: userGeolocation?.data?.lon
        },
      }
    } else {
      return {
        props: {
          country: 'Russia',
          lat: 55.755864,
          lon: 37.617698
        },
      }
    }

  } catch {
    return {
      props: {
        country: 'Russia',
        lat: 55.755864,
        lon: 37.617698
      },
    }
  }
}
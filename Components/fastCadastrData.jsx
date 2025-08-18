import React, { useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import QRCode from "react-qr-code"
import Cadastr from './info-cadastr';
import OwnersShot from './ownersShot';
import CheckRaports from './checkRaports';
import { ShortVisible } from './shortVisible';
import style from '../styles/File.module.css'

const FastCadastrData = ({cadastrData}) => {
  const [cadastrObj, setCadastrObj] = useState(null)
  const [isVisible, setIsVisible] = useState(true);
  const [ready, setReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300); // 10 минут в секундах
  const [stepTwoChecker, setTwoStepChecker] = useState(false)
  const [activate, setActivate] = useState(false)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [rightLoader, setRightLoader] = useState(true)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [fullContent, setFullContent] = useState(false)

  const router = useRouter()
  const path = router?.asPath

  const ref = useRef(null)

  const cadNumber = cadastrData?.[0]?.cadnum
  const rights = flatRights?.rightsData?.realty?.rights || cadastrObj?.result?.object?.rights || cadastrObj?.objectData?.rights ||
  cadastrObj?.elements?.[0]?.rights

  const addressNotes = cadastrData?.objectData?.objectAddress?.addressNotes || cadastrData?.objectData?.objectAddress?.mergedAddress || cadastrData.addressNotes || cadastrData?.objectData?.address?.mergedAddress || cadastrData.objectData?.objectAddress || cadastrData?.result?.object?.address || cadastrData?.elements?.[0]?.address?.readableAddress || cadastrData?.data?.features?.[0]?.properties?.options?.readable_address

  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1) || cadastrObj?.elements?.[0]?.rights.length !== 0

  const sendDataToServer = async () => {
    await axios.get(`/api/nspdCadNumData?cadNumber=${cadNumber}`)
    .then(({ data }) => {
        try {
          setCadastrObj(data)
        } catch {
          setCadastrObj(cadastrData)
        }
    })
  }

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

  useEffect(() => {

    sendDataToServer()
  }, [])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])

  useEffect(() => {
    setReady(false)
    setTimeout(() => {
      setReady(true)
    }, 500)
  }, [cadNumber])

  const focus = () => {
    ref?.current?.scrollIntoView({behavior: 'smooth'})
  }

const objectName =
  cadastrData?.[0]?.type === 'PARCEL' ? 'Земельный участок' : (
    cadastrData?.[0]?.type === 'OKS' ? 'Здание' : (
      cadastrData?.[0]?.type === "FLAT" ? 'Квартира' : 'Объект'
    )
  )


  return (
    <div className="layout2">
      <div className={style.object__wrap}>
        <div className={style.object__contentWrap}>
          <div className={style.object__content}>
          <div className={style.objectShortData} id="upTo" >
              <h1 ref={ref}>
              {objectName ? (
                   `${objectName}: ${cadNumber}`
                ) : (
                  `Объект недвижимости: ${cadNumber}`
                )}
             </h1>
                     {/* <p className='reportText'>Для объекта недвижимости ({ objectName ? (`${objectName} с кадастровым номером ${cadNumber}`) : (`с кадастровым номером ${cadNumber}`)}) доступны следущие виды отчетов:</p> */}
                      {/* <div className={style.reportDescritpion2}>
                      <div className={style.house__shortAddress}>{objectName ? (`${objectName === '01' ? 'Объект недвижимости' : objectName}`) : (`Объект недвижимости`)} - кадастровый номер {cadNumber} по адресу: {addressNotes}</div>
                        <div className={style.qr}>
                          <QRCode size={50} style={{ height: "auto", maxWidth: "100%", width: "100%" }} value={`https://cadmap.su${path}`} />
                        </div>
                      </div> */}
                    </div>
            {!fullContent &&
              <>
                <div className={style.cadastrContainer}>
                  <ShortVisible cadastrObj={JSON.stringify(cadastrData)} objName={objectName} />
                </div>
                </>
              }
            <details >
              <summary onClick={(() => setFullContent(!fullContent))}>{!fullContent ? 'Подробнее об объекте' : 'Скрыть'}</summary>
              <div className={style.cadastrContainer}>
                <Cadastr cadastrObj={JSON.stringify(cadastrObj)} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} setIsVisible={setIsVisible} isVisible={isVisible} cadastrData={cadastrData} objName={objectName} />
                <OwnersShot cadastrObj={flatRights} promoCode={promoCode} activate={activate} setPromoCode={setPromoCode} cadNumber={cadNumber} setActivate={setActivate} setIsVisible={setIsVisible} isVisible={isVisible} timeLeft={timeLeft} />
              </div>
            </details>
            {ready && <CheckRaports cadNum={cadNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} activate={activate} setTwoStepChecker={setTwoStepChecker} stepTwoChecker={stepTwoChecker} setPromoCode={setPromoCode} setActivate={setActivate} rightLoader={rightLoader} setRightLoader={setRightLoader} setIsVisible={setIsVisible} isVisible={isVisible} />}
          </div>
        </div>
      </div>
    </div>
   )
}

export default FastCadastrData



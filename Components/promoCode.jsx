import React, { useState, useEffect } from 'react'
import { PulseLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import style from '../styles/File.module.css'

const saleId = "Скидка активирована"
const notifySale = () => {
  toast.success("Скидка 20% активирована. Указанный процент скидки будет автоматически применен при оплате", {
    toastId: saleId,
    autoClose: 7000
  });
}


const PromoCode = ({ setPromoCode, cadNumber, setActivate, activate, isVisible}) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const path = router?.asPath
  const generatePromoCode = (length) => {
    const alphabet = 'BCDFGHJKLMNPQRSTVWXYZ';
    let promoCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      promoCode += alphabet.charAt(randomIndex);
    }
    return promoCode;
  };

  useEffect(() => {
    const generatedPromoCode = generatePromoCode(6); // Измените длину промокода по вашему усмотрению
    setPromoCode(generatedPromoCode);
  }, [cadNumber]);

  return ( !activate &&
    isVisible && <div
      className={`${style["test__rightblock_btnb"]} ${ style["test__rightblock_btnb--map"]}`}
      id="promocode"
      onClick={() => {
        setLoading(true)
        setTimeout(() => {
          setActivate(true)
          notifySale()
        }, 1000)
      }}
    >{loading ? (
      <div className={style.pulseLoader3}>
        <PulseLoader color="#AFB6BE" size={10} />
      </div>
    ) : (`Получить скидку 20%`)}
    </div>
  )
}

export default PromoCode

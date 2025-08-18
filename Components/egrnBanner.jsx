import React from 'react'
import { Link } from 'react-scroll'
import style from '../styles/File.module.css'

const EgrnBanner = () => {
  return (
    <div className={style.egrnBlock}>
      <div className={style["object__block-wrap"]}>
      <h3 className={style.egrnTitle}>Проверьте квартиру на юридическую чистоту перед покупкой</h3>
        <div className={style.bannerDescription}>
          <p className={style.repairInformation}>
            Для проверки выберите необходимую квартиру и перейдите к заказу отчетов на основе выписки из ЕГРН.
          </p>
        </div>
        <div className={style.egrnInfo}>
          <ul className={style.egrnList1}>
            <li>Отчет (выписка) об основных характеристиках: проверка квартиры на наличие арестов, залогов, обременений</li>
            <li>Отчет о собственниках: сведения о собственниках, включая ФИО</li>
            <li>Комплексная проверка квартиры и собственников с заключением юриста</li>
          </ul>
          <div className={style.egrnPhoto}></div>
        </div>
        <Link to="mkd-All-Flats" smooth="true" activeClass="active" spy={true} duration={500}>
          <button className={style.egrnButton}>Перейти к квартирам</button>
        </Link>
      </div>
    </div>
  )
}

export default EgrnBanner

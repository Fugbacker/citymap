import React from 'react'
import Link from 'next/link'
import MobileNavigation from './mobile-navigation'
import Navigation from './navigation'
import style from '../styles/File.module.css'
import { StepLabel } from '@material-ui/core'

export const Header = () => {
  return (
    <header className={style.small}>
      <div className="legal">
        <div className="legal_box">
          {/* <span className="legal_link">
            <span className="second_menu"><a className="button_menu" href="/help">Помощь</a></span>
            <span className="second_menu"><span className="button_menu show_promo">Скидки</span></span>
            <span className="second_menu"><a className="button_menu" href="/checkorder">Проверить заказ</a></span>
          </span> */}
        </div>
      </div>
      <div className={style.top_menu}>
        <div className={style.menus} id="menu">
        <div className={style.logo}>
          <div className={style.logo_name}><Link href="/" className={style.logo__name}>cadmap.su</Link></div>
          <strong className={style.logo_descr}>Картографический сервис</strong>
        </div>
          <Navigation />
          <MobileNavigation />
        </div>
      </div>
      {/* <div className={style.header_logo}>
        <div className={style.support}>
          <div className={style.mail}>Техническая поддержка <span className={style.nobr}>с 9.00 до 21.00 мск</span></div>
          <div className={`${style.mail} ${style["h-mylo"]}`} data-item1="cadmap.su" data-item2="e-mail: admin"></div>
        </div>
      </div> */}
      <div id="top"></div>
    </header>
  )
}

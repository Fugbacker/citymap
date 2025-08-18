import React from 'react'
import Link from "next/link"
import style from '../styles/File.module.css'

export const NavLinks = () => {
  return (
    <nav id="nav-wrap">
    {/* <ul id="nav">
      <li><Link className={`${style.bold} ${style.button_menu}`} href="/" title='публичная кадастровая карта'>Кадастровая карта</Link></li>
      <li><Link className={style.button_menu} href="/kadastrovaya_stoimost" title='Справка о кадастровой стоимости'>Кадастровая стоимость</Link></li>
      <li><Link className={style.button_menu} href="/kadastrovyy-nomer" title='кадастровый номер по адресу объекта недвижимости'>Кадастровый номер</Link></li>
      <li><Link className={style.button_menu} href="/spravochnaya_informaciya" title='Справочная информация по объектам недвижимости в режиме online'>Справочная информация</Link></li>
      <li><Link className={style.button_menu} href="/mejevanie" title='проверка участка на межевание'>Межевание</Link></li>
    </ul> */}
  </nav>
  )
}

export default NavLinks






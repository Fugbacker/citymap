import React from 'react'
import NavLinks from './navlinks'
import style from '../styles/File.module.css'

export const Navigation = () => {
  return (
    <nav className={style.header__menu}>
      <NavLinks />
    </nav>
  )
}

export default Navigation
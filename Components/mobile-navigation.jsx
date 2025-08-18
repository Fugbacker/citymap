import React, {useState} from 'react'
import NavLinks from './navlinks'
import {CgMenuGridR} from 'react-icons/cg'
import {CgClose} from 'react-icons/cg'
import style from '../styles/File.module.css'

export const MobileNavigation = () => {

  const [open, setOpen] = useState(false)

  const hamburgerIcon = <CgMenuGridR className={style.hamburger} size="35px" color="white"
                        onClick={() => setOpen(!open)}
                      />

  const hamburgerIconClose = <CgClose className={style.hamburger} size="35px" color="white"
                      onClick={() => setOpen(!open)}
                        />
  return (
    <nav className={style.mobileMenu}>
      {open ? hamburgerIconClose : hamburgerIcon}
      {open && <NavLinks />}
    </nav>
  )
}

export default MobileNavigation
import React, {useState} from 'react'
import MenuLeft from '../../menu-left'
import {CgMenuGridR} from 'react-icons/cg'
import {CgClose} from 'react-icons/cg'

export const MobileNavigationObject = () => {

  const [open, setOpen] = useState(false)

  const hamburgerIcon = <CgMenuGridR className="hamburger" size="35px" color="white"
                        onClick={() => setOpen(!open)}
                      />

  const hamburgerIconClose = <CgClose className="hamburger" size="35px" color="white"
                      onClick={() => setOpen(!open)}
                        />
  return (
    <nav className="mobileMenu">
      {open ? hamburgerIconClose : hamburgerIcon}
      {open && <MenuLeft />}
    </nav>
  )
}

export default MobileNavigationObject
import React, { useEffect, useState } from 'react'
import macroRegions from './files/macroRegions'
import rusRegions from './files/regionsWithNumber'
import Link from 'next/link'
import axios from 'axios'
import style from '../styles/File.module.css'

const MacroRegions = () => {
  const sortedMacroRegions = macroRegions.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  return (
    <div className={style.regionsContainer}>
    {sortedMacroRegions.map((it, index) => {
      return (
        <Link className={style.regionName} href={`/map/${it.key}`} key={index}>
          <div className={style.name}>{it.name}</div>
        </Link>
      )
    })}
    </div>
  )
}

export default MacroRegions
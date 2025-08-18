import React, { useEffect, useState } from 'react'
import macroRegions from './files/macroRegions'
import rusRegions from './files/regionsWithNumber'
import Link from 'next/link'
import axios from 'axios'
import style from '../styles/File.module.css'

const MacroUchastok = () => {
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
        <Link className={style.regionName} href={`/uchastki/${it.key}|${it.id}`} key={index}>
          <div className={style.name}>{it.name}</div>
          {/* <div className={style.statRegionContainer}>
            <div className={style.houseCount}>{it.houseCount}</div>
            <div className={style.alarmHouseCount}>{it.isAlarm.аварийные}</div>
            <div className={style.flats}>{it.flatsCount}</div>
          </div> */}
        </Link>
      )
    })}
    </div>
  )
}

export default MacroUchastok
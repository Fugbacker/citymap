import React, { useEffect, useState } from 'react'
import axios from 'axios'
import style from '../styles/File.module.css'

const Stats = () => {
  const [regionStats, setRegionStats] = useState([]);

  useEffect(() => {
    axios('/api/flatsCount')
    .then(({ data }) => setRegionStats(data))
  }, [])

  return (
    <div className={style.regionsContainer}>
    {regionStats.map((it, index) => {
      return (
        <a key={index} className={style.regionName} href={`/region/${it.engName}`}>
          <div className={style.name}>{it.rusName}</div>
          <div className={style.statRegionContainer}>
            <div className={style.houseCount}>{it.houseCount}</div>
            <div className={style.alarmHouseCount}>{it.isAlarm.аварийные}</div>
            <div className={style.flats}>{it.flatsCount}</div>
          </div>
        </a>
      )
    })}
    </div>
  )
}

export default Stats
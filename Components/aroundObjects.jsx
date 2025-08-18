import React, {useState, useEffect} from 'react'
import { PulseLoader } from 'react-spinners'
import axios from 'axios'
import Link from "next/link"
import style from '../styles/File.module.css'

const AroundObjects = ({ aroundObjects}) => {
  const [loading, setLoading] = useState(false)
  return (
    <div>
          {aroundObjects.map((it, index) => {
            return (
            // <a href={`/`} key={index} className="mkdLink1">
            //   <div className="objectListTr">
            //     <div className="objectListTd">{it?.properties?.options?.cad_num}</div>
            //     <div className="objectListTd">{it?.properties?.options?.cad_num}</div>
            //   </div>
            // </a>
              <a className="linkFlat" href={`/kadastr/${it?.properties?.options?.cad_num}`}>
              <div className="flat">
                <div
                  className="flatTableTr"
                  onClick={() => {
                    setLoading(true)
                  }}
                >
                  <div className="flatTableTd flatCadNum">{it?.properties?.options?.cad_num}</div>
                  <div className="flatTableTd flatAddress">{it?.properties?.options?.readable_address}</div>
                  {/* <button
                      className={style.button}
                  >
                  {loading ? (
                      <div className="pulseLoader3">
                        <PulseLoader color="#ff9d30" size={7} />
                      </div>
                  ) : ('Перейти')}
                  </button> */}
                </div>
              </div>
            </a>
            )
          })}
    </div>

  )
}

export default AroundObjects
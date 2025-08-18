import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Link from "next/link"

const RandomMkdObjects = () => {
  const [random, setRandom] = useState([])

  useEffect (async () => {
    const randomMkd = await axios(`/api/randData`)
    setRandom(randomMkd.data.slice(0, 6))
  }, [])

  return (
    <div className="randomObjects1">
      <div className="contentWrap">
        <div className="randomObjectsTitle1">Недавно найденные объекты</div>
        <div className="objectList">
          {random.map((it, index) => {
            return (
            <a href={`/mkd/${it?.region_id}-mkd-${it?.houseguid}`} key={index} className="mkdLink1">
              <div className="objectListTr">
                <div className="objectListTd">{it?.address}</div>
              </div>
            </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RandomMkdObjects
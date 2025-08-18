import React from 'react'
import { Link } from 'react-scroll'

const RepairBanner = () => {

  return (
    <div className="repairBlock">
      <div className="object__block-wrap">
        <div className="repairInfo">
          <h3 className="repairTitle">Нужен мастер по вызову?</h3>
          <ul className="egrnList1">
            <li>Ремонт электрики, сантехники, бытовая техники, квартир</li>
            <li>Ремонт кровли, подъездов, счетчиков, окон, балконов</li>
          </ul>
          <Link to="profi" smooth="true" activeClass="active" spy={true} duration={500}>
          <button className="egrnButton">Найти мастера</button>
        </Link>
        </div>
      </div>
    </div>
  )
}

export default RepairBanner

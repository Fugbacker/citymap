import React from 'react'
import { Link } from 'react-scroll'

export const CostWarning = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Внимание!</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Бесплатная информация о кадастровой стоимости объекта недвижимости носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальную кадастровую стоимость, необходимо заказать справку о кадастровой стоимости объекта недвижимости.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-scroll'

export const Cost = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Справка о кадастровой стоимости объекта недвижимости</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Справка о кадастровой стоимости - кадастровый документ, необходимый для верного расчета налога на недвижимость, формула которого базируется на кадастровой стоимости. Порядок проведения государственной кадастровой оценки регулируется Федеральным законом «Об оценочной деятельности в Российской Федерации» от 29.07.1998. Справка о кадастровой стоимости необходима для определения размера налога на имущество, оформления субсидий, получения кредита в банке, а так же для предъявления в иные государственные учреждения по требованию.</p>
          </div>
          <div className="table-cell twenty">
            <div className="sbox">
            <Link to="#" smooth="true" activeClass="active" spy={true} duration={500}><img src="/images/cs.png" title="Отчет о кадастровой стоимости" alt="Отчет о кадастровой стоимости" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

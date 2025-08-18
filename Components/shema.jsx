import React from 'react'
import { Link } from 'react-scroll'

export const Shema = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Схема образования участка</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Схема образования участка изготавливается на вновь образуемые земельные участки для предварительного согласования предоставления земельного участка в собственность или аренду. Схемы изготовляются в соответствии с Приказом Росреестра от 19.04.2022 № П/0148
            "Об утверждении требований к подготовке СРЗУ на КПТ и формату СРЗУ на КПТ в форме электронного документа. В том случае если изготовить схему невозможно (по какой-либо причине), деньги возвращаются клиенту.<br/><br/><strong>План создания схемы:</strong></p><br/>
            <ul>
              <li>Отрисовка полигона на желаемом месте создания участка</li>
              <li>Оплата заказа</li>
              <li>Анализ возможности изготовления схемы</li>
              <li>Изготовление схемы</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            {/* <div className="sbox">
              <a href="/images/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div> */}
            <div className="sbox">
            {/* <p className="exampleDocument">{'Образец >>'}</p> */}
              <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/shema.jpg" title="схема образования участка" alt="схема образования участка"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

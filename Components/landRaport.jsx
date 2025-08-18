import React from 'react'
import { Link } from 'react-scroll'

export const LandRaport = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Сводный отчет о земельном участке</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Сводный отчет о земельном участке является важным документом, который содержит подробную информацию р возможных пересечениях и ограничениях, которые не указана в отчете об основных характеристиках.</p>
            <p>В отчете могут отображаться не все ограничения и обременения, предусмотренные действующими нормативными документами, включая ЗОУИТы, сведения о которых отсутствуют в государственных информационных системах или сведения о которых относятся к информации ограниченного доступа. <strong>Рекомендуется заказывать данные отчеты в паре, чтобы получить максимум информации о земельном участке.</strong> Отчет формируется в течении нескольких часов, <strong>по форме и совокупности данных не соответствует формам предоставления сведений из ЕГРН и не содержит подписи ЭЦП.</strong> <br/><br/><strong>Отчет содержит:</strong></p><br/>
            <ul>
              <li>План участка;</li>
              <li>Технические сведения участка;</li>
              <li>Обременения, ограничения (при их наличии);</li>
              <li>Пересечение с ЗОУИТ (при их наличии);</li>
              <li>Пересечение с другими участками (при их наличии);</li>
              <li>Сведения о зданиях и сооружениях (если они внесены в реестр);</li>
              <li>Расположение внутри зон;</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            {/* <div className="sbox">
              <a href="/images/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div> */}
            <div className="sbox">
            {/* <p className="exampleDocument">{'Образец >>'}</p> */}
              <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/landRaport.jpg" title="Сводный отчет о земельном участке" alt="Сводный отчет о земельном участке"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

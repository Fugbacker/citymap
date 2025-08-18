import React from 'react'
import { Link } from 'react-scroll'

export const GlobalWithOwner = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Отчет об основных о характеристиках объекта недвижимости</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Отчет на основе выписки из ЕГРН об основных характеристиках объекта недвижимости. Обязателен для проверки недвижимости перед сделкой и подписанием договора на наличие обременений, залогов и различного рода ограничений. Может быть предоставлен по месту требования.<br/><br/><strong>Отчет содержит:</strong><br/></p><br/>
            <ul>
              <li>Площадь квартиры</li>
              <li>Назначение</li>
              <li>Кадастровую стоимость квартиры</li>
              <li>ФИО собственников (при их наличии)</li>
              <li>Вид права собственности и дату его регистрации (может отсутствовать)</li>
              <li>Информация о дееспособности владельца (может отсутствовать)</li>
              <li>Данные об аресте, залоге, других обременениях (при их наличии)</li>
              <li>Дата регистрации права</li>
            </ul>
          </div>
          {/* <div className="table-cell twenty">
            <div className="sbox">
              <p className="exampleDocument">{'Образец >>'}</p>
              <a href="/images/pdf/owner.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/rosreestr/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div>
          </div> */}
          <div className="table-cell twenty">
            <div className="sbox">
            <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/oh1.png" title="Отчет об основных характеристиках" alt="Отчет об основных характеристиках"/></Link>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

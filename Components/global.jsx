import React from 'react'
import { Link } from 'react-scroll'

export const Global = () => {
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
            <p>Отчет на основе выписки из ЕГРН об основных характеристиках объекта недвижимости. Обязателен для проверки недвижимости перед сделкой и подписанием договора на наличие обременений, залогов и различного рода ограничений.<br/><br/><strong>Отчет содержит:</strong><br/></p><br/>
            <ul>
              <li>Площадь квартиры, здания или участка</li>
              <li>Назначение</li>
              <li>Кадастровую стоимость объекта недвижимости</li>
              <li>Вид собственника (юридическое или физическое лицо)</li>
              <li>Технический план квартиры или кадастровый план земельного участка (может отсутствовать)</li>
              <li>Вид права собственности и дату его регистрации (может отсутствовать)</li>
              <li>Информация о дееспособности владельца (может отсутствовать)</li>
              <li>Данные об аресте, залоге, других обременениях (при их наличии)</li>
              <li>Дата регистрации права</li>
            </ul>
          </div>
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

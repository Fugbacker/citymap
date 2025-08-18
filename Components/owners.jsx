import React from 'react'
import { Link } from 'react-scroll'

export const Owners = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="hundred">
            <h3>Отчет о переходе прав на объект недвижимости</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Общая информация об объекте недвижимости, вид собственника (юридическое или физическое лицо), наличие или отсутствие ограничений, обременений, арестов. Не содержит ФИО.<br/><br/><strong>Отчет содержит:</strong><br/></p><br/>
            <ul>
              <li>Вид собственников (юридическое или физическое лийцо)</li>
              <li>Доля в праве собственности</li>
              <li>Вид права собственности</li>
              <li>Количество собственников</li>
              <li>Полная история собственников</li>
              <li>Даты регистрации прав</li>
              <li>Даты прекращения прав</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            <div className="sbox">
            {/* <p className="exampleDocument">{'Образец >>'}</p> */}
            <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/op.png" title="отчет о переходе прав" alt="отчет о переходе прав" /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

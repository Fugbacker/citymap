import React from 'react'
import { Link } from 'react-scroll'

export const OwnersWithPersonalData = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="hundred">
            <h3>Сведения о собственниках</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Полная история собственников с 1998 года, включая ФИО. Если наличие ФИО собственника не приницпиально, а важно знать количество фактов смены сосбтвенников объекта недвижимости, достаточно заказать отчет о переходе прав.<br/><br/><strong>Отчет содержит:</strong><br/></p><br/>
            <ul>
              <li>ФИО собственников</li>
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
            <Link to="#" smooth="true" activeClass="active" spy={true} duration={500}><img src="/images/ss.png" title="отчет о собственниках" alt="отчет о собственниках"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

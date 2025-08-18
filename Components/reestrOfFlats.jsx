import React from 'react'

export const ReestrOfFlats = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="hundred">
            <h3>Реестр помещений многоквартирного дома</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <h4>Что содержит:</h4>
            <ul>
              <li>Кадастровые номера помещений</li>
              <li>Тип помещений</li>
              <li>Площадь помещений</li>
              <li>Количество собственников каждого помещения</li>
              <li>Вид собственника</li>
              <li>Право</li>
              <li>Доля в праве</li>
              <li>Дата регистрации права</li>
              <li>Дата прекращения права</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            <div className="sbox">
              <a href="/documents/reestr.xls" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/reestr.jpg" title="Реестр помещений мкд" alt="Реестр помещений мкд"/><span className="exampless__zoom"></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

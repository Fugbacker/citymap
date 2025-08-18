import React from 'react'
import { Link } from 'react-scroll'

export const Express = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Экспресс отчет</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Экспресс отчет об объекте недвижимости, содержащий основные технические сведения объекта недвижимости, сведения о количестве собственников, а так же о наличии обременений и ограничений. В отличие от отчета об основных характеристиках, формируетсяв течении 1 часа, <strong>по форме и совокупности данных не соответствует формам предоставления сведений из ЕГРН и не содержит подписи ЭЦП.</strong> <br/><br/><strong>Отчет содержит:</strong></p><br/>
            <ul>
              <li>Площадь квартиры</li>
              <li>Назначение</li>
              <li>Кадастровую стоимость квартиры</li>
              <li>Количество собственников (при их наличии)</li>
              <li>Вид права собственности и дату его регистрации (может отсутствовать)</li>
              <li>Данные об аресте, залоге, других обременениях (при их наличии)</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            {/* <div className="sbox">
              <a href="/images/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div> */}
            <div className="sbox">
            {/* <p className="exampleDocument">{'Образец >>'}</p> */}
              <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/exp_min.jpg" title="экспресс отчет" alt="экспресс отчет"/></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

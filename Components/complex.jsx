import React from 'react'

export const Complex = () => {
  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Комплексная проверка объекта недвижимости и собственника</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Комплексная проверка объекта недвижимости на предмет наличие ограничений (обременений) и собственника (собственников) ФЛ на наличие задолженностей, нахождение в базе данных розыска, должников, в реестре судебных дел и банкротств. <br/><strong>Не производится проверка объектов недвижимости, собственниками которых являются <u>юридические лица</u></strong>. <br/><br/>Отчет включает сведения из следующих источников:</p><br/>
            <ul>
              <li>Единый Государственный Реестр Недвижимости (ЕГРН)</li>
              <li>Министерство внутренних дел (МВД)</li>
              <li>Федеральная служба судебных приставов (ФССП)</li>
              <li>Федеральная служба исполнения наказаний (ФСИН)</li>
              <li>Единый федеральный реестр сведений о банкротстве (ЕФРСБ)</li>
              <li>Федеральная нотариальная палата (ФНП)</li>
              <li>Данные из арбитражных судов и судов общей юрисдикции</li>
            </ul>
          </div>
          <div className="table-cell twenty">
            {/* <div className="sbox">
              <a href="/images/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-img" data-fancybox-type="iframe"><img src="/images/egrn_1_min.jpg" title="Отчет об истории владения недвижимостью" alt="Отчет об истории владения недвижимостью"/><span className="exampless__zoom"></span></a>
            </div> */}
            <div className="sbox">
            <p className="exampleDocument">{'Образец >>'}</p>
              <a href="/images/pdf/f_check.pdf" target="_blank" className="fancybox example-list-wrapper-img fancy-pdf" data-fancybox-type="iframe"><img src="/images/rosreestr/f_check_min.jpg" title="Сводный отчет комплексной проверки недвижимости на юридическую чистоту" alt="Проверка недвижимости на арест, обременение, залог"/><span className="examples__zoom"><meta itemProp="image" content="https://regrs.su/images/pdf/f_check.pdf"/></span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

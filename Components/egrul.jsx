import { useState, useEffect } from 'react'
import { Link } from 'react-scroll'
import style from '../styles/File.module.css'

export const Egrul = () => {
  const [tempImg, setTempImg] = useState('')
  const [model, setModel] = useState(false)
  const getImg = (img) => {
    setTempImg(() => img)
    setModel(true)
  }


  return (
    <div className='tooltipText'>
      <div className="table">
        <div className="table-row">
          <div className="table-cell hundred">
            <h3>Выписка из ЕГРЮЛ (ЕГРИП)</h3>
            <hr/>
          </div>
        </div>
      </div>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <p>Выписка ЕГРЮЛ (ЕГРИП) — это информация о конкретном юридическом лице или индивидуальном предпринимателе из единого государственного реестра Федеральной налоговой службы. Выписка из ЕГРЮЛ содержит:</p>
            <ul>
              <li>полное и сокращенное наименование организации;</li>
              <li>наименование на иностранном языке;</li>
              <li>юридический адрес;</li>
              <li>номер ОГРН, ИНН и КПП;</li>
              <li>номер ФСС и ПФР;</li>
              <li>способ образования юридического лица;</li>
              <li>дата регистрации;</li>
              <li>сведения об учёте в налоговом органе;</li>
              <li>размер капитала;</li>
              <li>ФИО и должность руководителя;</li>
              <li>учредителей и их доли в организации;</li>
              <li>представительства и филиалы;</li>
              <li>лицензии;</li>
              <li>виды деятельности организации;</li>
              <li>cведения о внесённых записях;</li>
              <li>отметки о недостоверных сведениях;</li>
              <li>состояние о реорганизации, ликвидации и предстоящем исключении;</li>
              <li>дата и причина ликвидации.</li>
            </ul>
          </div>
          {/* <div className="table-cell twenty">
            <div className="sbox">
            <Link to="#" activeClass="active" smooth="true" spy={true} duration={500}><img src="/images/oh1.png" title="Отчет об основных характеристиках" alt="Отчет об основных характеристиках"/></Link>
            </div>
          </div> */}
          <div className={style.sbox}>
            <Link className={style.fancybox + " example-list-wrapper-img"} onClick={() => {getImg(`/images/ecpegrul.jpg`)}}>
              <img alt="бесплатная выписка егрюл из налоговой с ЭЦП" title="бесплатная выписка егрюл из налоговой с ЭЦП" src="/images/ecpegrul.jpg" />
              <span className={style.examples__zoom}></span>
            </Link>
          </div>
        </div>
      </div>
      <div className={model ? 'model open' : 'model'}>
        <img src={tempImg} alt="" aria-hidden="true" onClick={() => setModel(false)} />
        {/* <CloseIcon onClick={() => setModel(false)} /> */}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Link } from 'react-scroll'
import  { useSession } from 'next-auth/react'

const Owners = ({ cadastrObj }) => {
  const [owner, setOwner] = useState(false)
  const cadObj = owner
  const rights = cadObj?.realty?.rights || cadObj?.rights?.realty?.rights
  const rightsCount = cadObj?.realty?.rights?.filter((it) => it?.rightState === 1).length || cadObj?.rights?.realty?.rights?.filter((it) => it?.rightState === 1).length
  const { data: session } = useSession()
  const tryTouchPromise = async () => {
    const a = await cadastrObj
    setOwner(a)
  }
  tryTouchPromise()

  const outputObject = (item) => {
    const paramInfo =  {
      'Дата регистрации собственности:': item.regDate,
      'Тип собственности': item.typeName,
      'ФИО собственника': <div className="closedData"><p>доступны в отчете о собственниках</p></div>,
      'Регистрационный номер': <div className="closedData"><p>доступны в отчете о переходе прав</p></div>,
    }

    const paramInfo1 =  {
      'Тип собственности': item.typeName,
      'Регистрационный номер': item.regNmbr,
      'Дата регистрации собственности:': item.regDate,
      'Дата актуализации информации:': item.dateL,
    }

    return Object.keys(paramInfo).map((it, ind) => {
      return paramInfo[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObject1 = (item) => {
    const paramInfo1 =  {
      'Тип собственности': item.typeName,
      'Регистрационный номер': item.regNmbr,
      'Дата регистрации собственности:': item.regDate,
      'Дата актуализации информации:': item.dateL,
    }


    return Object.keys(paramInfo1).map((it, ind) => {
      return paramInfo1[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo1[it]}</div>
        </div>
      )
    })
  }

  return (
    <>
        <div data-content="main" className="object__block" id="owners-info">
      <div className="object__block-wrap">
        <div className="object__block-title _owner">
          <h2>Собственники</h2>
        </div>
        {/* <div className="flatTableHead">
          {!session ?<div className="ownersCount">{rights && (`Количество собственников ${rightsCount}`)}</div>:''}
        </div> */}
        {rights?.filter((it) => it?.rightState === 1)
          .map((it, ind) => {
            return (
              <div key={it.externalId}>
                <div className="object__block-title-2 _ownerOne">
                  {`Собственник ${ind + 1}`}
                </div>
                <div className="object__blockTable">
                  {!session ? outputObject(it): outputObject1(it)}
                </div>
              </div>
            )
          })}
          {!session ? <div className="btnHistory">{rights && (<Link to="egrn" smooth="true" spy={true} duration={500}><span>Заказать отчет</span></Link>)}</div> :''}
          <div className="historyInfo">ФИО собственников доступны только при заказе отчета о собтвенниках. Отчет является обязательным при проверке недвижимости на юридическую чистоту.</div>
      </div>
    </div>
        {/* <div data-content="main" className="object__block" id="owners-history">
        <div className="object__block-wrap">
          <div className="object__block-title _owner">
            <h2>История собственников c 1998 года.</h2>
          </div>
          <div className="flatTableHead">
            <div className="historyOwner">{rights && ('Информация о всех зарегистрированных собственниках данного объекта с 1998 года.')}</div>
            <div className="ownersCount">{rights && (<Link to="egrn" smooth="true" spy={true} duration={500}><span>заказать отчет</span></Link>)}</div>
          </div>
          <div className="object__blockTable">
            <div className="object__blockTableTr">
              <div className="object__blockTableTd">Тип собственников</div>
              <div className="object__blockTableTd"><div className="closedData"><p>Данные по запросу</p></div></div>
            </div>
            <div className="object__blockTableTr">
              <div className="object__blockTableTd">Доля в праве собственности</div>
              <div className="object__blockTableTd"><div className="closedData"><p>Данные по запросу</p></div></div>
            </div>
            <div className="object__blockTableTr">
              <div className="object__blockTableTd">Вид права собственности</div>
              <div className="object__blockTableTd"><div className="closedData"><p>Данные по запросу</p></div></div>
            </div>
            <div className="object__blockTableTr">
              <div className="object__blockTableTd">Дата регистрации права собственности</div>
              <div className="object__blockTableTd"><div className="closedData"><p>Данные по запросу</p></div></div>
            </div>
            <div className="object__blockTableTr">
              <div className="object__blockTableTd">Дата прекращения права собственности</div>
              <div className="object__blockTableTd"><div className="closedData"><p>Данные по запросу</p></div></div>
            </div>

          </div>
          <div className="btnHistory">{rights && (<Link to="egrn" smooth="true" spy={true} duration={500}><span>Заказать отчет</span></Link>)}</div>
          <div class="historyInfo">Данные из отчета о переходе прав предоставляется по запросу граждан и формируется на дату запроса. В отчете об основных характеристиках содержится только сводная информация и вид собственника (физическое или юридическое лицо). Отчет о собственниках, в дополнение к сводной информации, содержит ФИО собственников.</div>
        </div>
      </div> */}
    </>
  )
}

export default Owners

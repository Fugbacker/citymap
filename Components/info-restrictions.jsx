import React, { useState } from 'react'
import { Link } from 'react-scroll'
import  { useSession } from 'next-auth/react'

const Restriction = ({ cadastrObj }) => {
  const { data: session } = useSession()
  const [restrictions, setRestricions] = useState(false)
  const cadObj = restrictions
  const encumbrances = cadObj?.realty?.encumbrances || cadObj?.rights?.realty?.encumbrances
  const encumbrancesCheck = encumbrances?.filter((it) =>  it?.encmbState === 1)

  const tryTouchPromise = async () => {
    const a = await cadastrObj
    setRestricions(a)
  }
  tryTouchPromise()

  const outputObject = (item) => {
    const paramInfo =  {
      'Наличие обременений': <p className="restrictions">Есть</p>,
      // 'Наличие арестов': <p className="restrictions">Требуется проверка</p>,
      'Регистрационный номер:': item?.regNmbr,
      'Дата регистрации обременения': item?.regDate,
      'Дата окончания обременения': item?.dateStop,
      'Дополнительные сведения': <div className="closedData"><p>данные по запросу</p></div>,
      'Причина': <div className="closedData"><p>данные по запросу</p></div>,
      'Кем наложено ограничение': <div className="closedData"><p>данные по запросу</p></div>
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObject1 = (item) => {
    const paramInfo =  {
      'Обременение':item?.typeName,
      // 'Наличие арестов': <p className="restrictions">Требуется проверка</p>,
      'Регистрационный номер:': item?.regNmbr,
      'Дата регистрации обременения': item?.regDate,
      'Дата окончания обременения': item?.dateStop,
      'Дата актуализации информации': item?.dateL,
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObjectSession = () => {
    const paramInfo =  {
      'Наличие обременений': <p className="restrictionsNull">Не зарегистрированы на момент запроса</p>,
      'Наличие арестов': <div className="closedData"><p>данные по запросу</p></div>,
      'Наличие залогов': <div className="closedData"><p>данные по запросу</p></div>,
      'Правопритязания на объект': <div className="closedData"><p>данные по запросу</p></div>,
      'Запрет на регистрацию без личного участия': <div className="closedData"><p>данные по запросу</p></div>,
      'Недвижимость в ипотеке': <div className="closedData"><p>данные по запросу</p></div>,
      'Возражения о регистрации права': <div className="closedData"><p>данные по запросу</p></div>,
      'Записи о сдачи в аренду': <div className="closedData"><p>данные по запросу</p></div>,
      'Решение об изъятие квартиры для государства ': <div className="closedData"><p>данные по запросу</p></div>,
      'Иные ограничения или обременения': <div className="closedData"><p>данные по запросу</p></div>,
    }

    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObjectSession1 = () => {
    const paramInfo =  {
      'Наличие обременений': <p className="restrictionsNull">Отсутствует</p>,
      'Наличие арестов': <p className="restrictionsNull">Отсутствует</p>,
      'Наличие залогов': <p className="restrictionsNull">Отсутствует</p>,
      'Правопритязания на объект': <p className="restrictionsNull">Отсутствует</p>,
      'Запрет на регистрацию без личного участия': <p className="restrictionsNull">Отсутствует</p>,
      'Недвижимость в ипотеке': <p className="restrictionsNull">Отсутствует</p>,
      'Возражения о регистрации права': <p className="restrictionsNull">Отсутствует</p>,
      'Записи о сдачи в аренду': <p className="restrictionsNull">Отсутствует</p>,
      'Решение об изъятие квартиры для государства ': <p className="restrictionsNull">Отсутствует</p>,
      'Иные ограничения или обременения': <p className="restrictionsNull">Отсутствует</p>,
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} className="object__blockTableTr">
          <div className="object__blockTableTd">{it}</div>
          <div className="object__blockTableTd">{paramInfo[it]}</div>
        </div>
      )
    })
  }

  return (
    <>
      <div id="restrictions-info" className="object__block">
        <div className="object__block-wrap">
          <div className="object__block-title _restrictions">
            <h2>Обременения и ограничения</h2>
          </div>
          {!session ? <div className="information">
              <p className="att">Информация об ограничениях, обременения и арестах. Перед совершением сделки купли-продажи обязательно проверьте объект недвижимости.</p>
          </div> :''}
          {encumbrances && encumbrancesCheck.length !== 0 ? encumbrances?.filter((it) => it.encmbState === 1 )
            .filter((item, i, arr) => arr.findIndex((it) => it?.typeName === item?.typeName && it?.regNmbr === item?.regNmbr) === i)
            .map((it, ind) => {
              return (
                <div key={it.externalId}>
                  <div className="object__block-title-2 products">
                    {`${`Ограничение № ${ind + 1}`}`}
                  </div>
                  <div className="object__blockTable">
                    {!session ? outputObject(it) : outputObject1(it)}
                  </div>
                </div>
              )
            })
            :
            <div className="object__blockTable">
              {!session ? outputObjectSession() : outputObjectSession1()}
            </div>
            }
             {!session && <div className="btnHistory"><Link to="egrn" smooth="true" spy={true} duration={500}><span>Заказать отчет</span></Link></div>}
             <div className="historyInfo">Информация об ограничениях, обременения и арестах. Перед совершением сделки купли-продажи обязательно проверьте объект недвижимости.</div>
        </div>
      </div>

      {session ? <div id="restrictions-info" className="object__block">
       <div className="object__block-wrap">
        <div className="object__block-title _restrictions">
          <h2>Итоговое заключение</h2>
        </div>
        {(encumbrances && encumbrancesCheck.length !== 0) ?
          <div className="house__shortAddressAlert">
            Найдены записи, свидетельствующие о наличии ограничений на объект
            недвижимости. Для минимизации рисков при совершении сделок,
            рекомендуем заказать комплексную проверку объекта недвижимости.
          </div>
          :
          <>
            <div className="house__shortAddress2">
             Согласно общедоступным данным, используемых дял создания отчета, объект недвижимости не заложен, не обременен и не арестован.
            </div>
            <div className="object__blockTable">
              <div className="object__blockTableTr">
                <div className="object__blockTableTd">{'Проблемы, ограничения, риски:'}</div>
                <div className="object__blockTableTd"><p className="restrictionsNull">Нет</p></div>
              </div>
              <div className="object__blockTableTr">
                <div className="object__blockTableTd">{'Операции и сделки с объектом недвижимости:'}</div>
                <div className="object__blockTableTd"><p className="restrictionsNull">Возможны</p></div>
              </div>
            </div>
          </>
          }
      </div>
      </div>:''}
    </>
  )
}

export default Restriction

import React, { useState } from 'react'
import  { useSession } from 'next-auth/react'

const InfoRestrictionsReport = ({ cadastrObj }) => {
  const { data: session } = useSession()
  const encumbrances = cadastrObj?.realty?.encumbrances || cadastrObj?.rights?.realty?.encumbrances || cadastrObj?.rights?.realty?.rights || cadastrObj?.elements?.[0]?.encumbrances
  const workingEncumbrances =  encumbrances || (Array.isArray(encumbrances) && encumbrances?.filter((it) => it?.encmbState === 1))
  const encumbrancesCheck = cadastrObj?.result?.object?.restrictionsCount
  console.log('encumbrancesCheck', encumbrancesCheck)


  // const encumbrancesCheck = encumbrances?.filter((it) =>  it?.encmbState === 1)
  // const encumbrancesCheck = encumbrances?.filter((it) =>  it?.encumbrances)

  const outputObject2 = (item) => {
    const paramInfo =  {
      'Обременение':<p style={{color: '#AF0A0A', fontWeight: '600'}}>Есть</p>,
      'Количество обременений': <p style={{color: '#AF0A0A', fontWeight: '600'}}>{encumbrancesCheck}</p>,
      'Наличие арестов': <p style={{color: '#AF0A0A'}}>Требуется проверка</p>,
      'Регистрационный номер:': <p style={{color: '#AF0A0A'}}>Требуется проверка</p>,
      'Дата регистрации обременения': <p style={{color: '#AF0A0A'}}>Требуется проверка</p>,
      'Дата окончания обременения': <p style={{color: '#AF0A0A'}}>Требуется проверка</p>,
      'Дата актуализации информации': <p style={{color: '#AF0A0A'}}>Требуется проверка</p>,
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} style={{display: 'table-row'}}>
          <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
          <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObject1 = (item) => {
    const paramInfo =  {
      'Обременение:':item?.encumbrances?.[0]?.codeDesc || item?.typeName || item?.typeDesc,
      // 'Наличие арестов': <p className="restrictions">Требуется проверка</p>,
      'Регистрационный номер:': item?.encumbrances?.[0]?.regNum || item?.regNmbr || item?.encumbranceNumber,
      'Дата регистрации обременения:': item?.encumbrances?.[0]?.regDate || item?.regDate || item?.startDate && new Date(item?.startDate).toISOString().split('T')[0],
      'Дата окончания обременения': item?.dateStop,
      'Дата актуализации информации:': item?.encumbrances?.[0]?.actualDate || item?.dateL,
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} style={{display: 'table-row'}}>
          <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
          <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  const outputObjectSession1 = () => {
    const paramInfo =  {
      'Наличие обременений': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Наличие арестов': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Наличие залогов': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Правопритязания на объект': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Запрет на регистрацию без личного участия': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Недвижимость в ипотеке': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      // 'Возражения о регистрации права': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      // 'Записи о сдачи в аренду': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      // 'Решение об изъятие квартиры для государства ': <p style={{color: '#3faa29'}}>Отсутствует</p>,
      'Иные ограничения или обременения': <p style={{color: '#3faa29'}}>Отсутствует</p>,
    }
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <div key={it} style={{display: 'table-row'}}>
          <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
          <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  return (
    <>
      <div style={{ marginBottom: '15px', padding: '10px 0' }}>
          <div>
            <h2>Обременения и ограничения</h2>
          </div>
          {/* {encumbrances && encumbrancesCheck.length !== 0 ? encumbrances?.filter((it) => it.encmbState === 1 )
            .filter((item, i, arr) => arr.findIndex((it) => it?.typeName === item?.typeName && it?.regNmbr === item?.regNmbr) === i)
            .map((it, ind) => {
              return (
                <div key={it.externalId}>
                  <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: '25px', color: '#2D3C5F', marginBottom: '10px' }}>
                    {`${`Ограничение № ${ind + 1}`}`}
                  </div>
                  <div style={{ display: 'table', width: '100%' }}>
                    {outputObject1(it)}
                  </div>
                </div>
              )
            }) */}
          {/* {workingEncumbrances && workingEncumbrances.length !==0 ? workingEncumbrances.map((it, ind) => {
              return (
                <div key={ind}>
                  <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: '25px', color: '#2D3C5F', marginBottom: '10px' }}>
                    {`${`Ограничение № ${ind + 1}`}`}
                  </div>
                  <div style={{ display: 'table', width: '100%' }}>
                    {outputObject1(it)}
                  </div>
                </div>
              )
            })
            :
            <>
            <div style={{ display: 'table', width: '100%' }}>
              {outputObjectSession1()}
            </div>
            <div style={{ color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px 20px', fontWeight: 600 }}>Информация об ограничениях, обременения и арестах. Перед совершением сделки купли-продажи обязательно проверьте объект недвижимости.</div>
            </>
            } */}
             {encumbrancesCheck && encumbrancesCheck !== 0 ?
              <>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: '25px', color: '#2D3C5F', marginBottom: '10px' }}>
                  </div>
                  <div style={{ display: 'table', width: '100%' }}>
                    {outputObject2()}
                  </div>
                </div>
                <div style={{ color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px 20px', fontWeight: 600 }}>Информация об ограничениях, обременения и арестах доступна в полном объеме в отчете об основных характеристиках объекта недвижимости. Перед совершением сделки купли-продажи обязательно проверьте объект недвижимости.</div>
              </>
              :
              <>
              <div style={{ display: 'table', width: '100%' }}>
                {outputObjectSession1()}
              </div>
              <div style={{ color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px 20px', fontWeight: 600 }}>Информация об ограничениях, обременения и арестах. Перед совершением сделки купли-продажи обязательно проверьте объект недвижимости.</div>
              </>
            }

      </div>
      <div style={{marginBottom: '15px'}}>
        <div>
          <h2>Итоговое заключение</h2>
        </div>
        {encumbrancesCheck && encumbrancesCheck !== 0 ?
          <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: '17px', color: 'red', position: 'relative', textAlign: 'justify' }}>
            Найдены записи, свидетельствующие о наличии ограничений на объект недвижимости. Для минимизации рисков при совершении сделок,
            рекомендуем заказать комплект отчетов, а именно: расширенный отчет об основных характеристиках и отчет о собственниках.
          </div>
          :
          <>
            <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: '17px', color: '#8a95a2', padding: '10px 20px', marginBottom: '20px', background: '#f9f9f9' }}>
             Согласно общедоступным данным, используемых дял создания отчета, объект недвижимости не заложен, не обременен и не арестован.
            </div>
            <div style={{ display: 'table', width: '100%' }}>
              <div style={{display: 'table-row'}}>
                <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{'Проблемы, ограничения, риски:'}</div>
                <div style={{ display: 'table-cell', paddingLeft: '40px', fontSize: '14px', width: '60%'}}><p style={{color: '#3faa29'}}>Нет</p></div>
              </div>
              <div style={{display: 'table-row'}}>
                <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{'Операции и сделки с объектом недвижимости:'}</div>
                <div style={{ display: 'table-cell', paddingLeft: '40px', fontSize: '14px', width: '60%'}}><p style={{color: '#3faa29'}}>Возможны</p></div>
              </div>
            </div>
          </>
          }
      </div>
    </>
  )
}

export default InfoRestrictionsReport

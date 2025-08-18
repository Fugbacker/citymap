import React, { useState } from 'react'
import { Link } from 'react-scroll'
import  { useSession } from 'next-auth/react'

const InfoOwnersReport = ({ cadastrObj, rightsData }) => {
  // const [value, setValue] = useState([])
  // const tryTouchPromise = async () => {
  //   const a = await cadastrObj
  //   setValue(a)
  // }
  // tryTouchPromise()

  const rights = cadastrObj?.realty?.rights || cadastrObj?.rights?.realty?.rights || cadastrObj?.rights || cadastrObj?.rightEncumbranceObjects || cadastrObj?.rights?.realty?.rights?.filter((it) => it?.rightState === 1) || rightsData


  // const rightsCount = cadObj?.realty?.rights?.filter((it) => it?.rightState === 1).length || cadObj?.rights?.realty?.rights?.filter((it) => it?.rightState === 1).length
  // const { data: session } = useSession()
  // const tryTouchPromise = async () => {
  //   const a = await cadastrObj
  //   setOwner(a)
  // }
  // tryTouchPromise()



  // const outputObject1 = (item) => {
  //   const paramInfo1 =  {
  //     'Тип собственности': item.typeName,
  //     'Регистрационный номер': item.regNmbr,
  //     'Дата регистрации собственности:': item.regDate,
  //     'Дата актуализации информации:': item.dateL,
  //   }

  //   return Object.keys(paramInfo1).map((it, ind) => {
  //     return paramInfo1[it] && (
  //       <div key={it} style={{display: 'table-row'}}>
  //         <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
  //         <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo1[it]}</div>
  //       </div>
  //     )
  //   })
  // }

  const outputObject1 = (item) => {
    const paramInfo1 =  {
      'Тип собственности:': item?.rightData?.codeDesc || item?.typeName || item?.description || item?.rightTypeDesc,
      'Регистрационный номер:': item?.rightData?.regNum || item?.regNmbr || item?.number || item?.rightNumber,
      'Дата регистрации собственности:': item?.rightData?.regDate || item?.regDate || item?.regDate || item?.rightRegDate && new Date(item?.rightRegDate).toISOString().split('T')[0],
      'Дата актуализации информации:': item?.rightData?.actualDate || item?.dateL,
      'Доля в праве:': item?.part
    }

    return Object.keys(paramInfo1).map((it, ind) => {
      return paramInfo1[it] && (
        <div key={it} style={{display: 'table-row'}}>
          <div style={{ display: 'table-cell', padding: '3px', fontSize: '14px' }}>{it}</div>
          <div style={{ paddingLeft: '40px', width: '60%', fontSize: '14px', display: 'table-cell' }}>{paramInfo1[it]}</div>
        </div>
      )
    })
  }

  return (
    <>
      <div style={{marginBottom: '15px'}}>
        <div>
          <h2>Собственники</h2>
        </div>
        {Array.isArray(rights) && rights?.filter((it) => it?.rightData || it?.rightState === 1).length !== 0 ? rights?.filter((it) => it?.rightData || it?.rightState === 1)
          .map((it, ind) => {
            return (
              <div key={it.externalId}>
                <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: '25px', color: '#2D3C5F', marginBottom: '10px', marginTop: '10px'}}>
                  {`Собственник ${ind + 1}`}
                </div>
                <div style={{ display: 'table', width: '100%' }}>
                  {outputObject1(it)}
                </div>
              </div>
            )
          }) :
          rights.map((it, ind) => {

            return (
              <div key={it.externalId}>
                <div style={{ fontWeight: '800', fontSize: '15px', lineHeight: '25px', color: '#2D3C5F', marginBottom: '10px', marginTop: '10px'}}>
                  {`Собственник ${ind + 1}`}
                </div>
                <div style={{ display: 'table', width: '100%' }}>
                  {outputObject1(it)}
                </div>
              </div>
            )
          })
          }

          <div style={{ color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px 20px', fontWeight: 600 }}>ФИО собственников доступны только при заказе отчета о собтвенниках. Бесплатная информация о праве собственности объекта недвижимости 77:01:0003055:1980 носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальные сведения, необходимо заказать отчет об основных характеристиках объекта недвижимости.</div>
    </div>
    </>
  )
}

export default InfoOwnersReport

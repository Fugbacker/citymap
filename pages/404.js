
import React, { useState } from 'react'
import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import { Search } from "@/Components/search"
import Breadcrumbs from "@/Components/breadcrumbs"

export default function Main() {
  const [cadastrData, setCadastrData] = useState([])
  const descriptionMkd = `В настоящий момент мы не смогли найти информацию об объекте недвижимости. Это может быть связано с недоступностью серверов или с ошибкой при вводе
  адреса. Попробуйте произвести поиск еще раз.`

  return (
    <>
      <div className="first">
        <Header />
          <div className="pledge pageArrest">
            <div className="mainCadastr">
              <div className="content1">
                <Breadcrumbs />
                <Search cadastrData={cadastrData} setCadastrData={setCadastrData}/>
              </div>
            </div>
            {cadastrData.length === 0 &&
              <div className="content1">
                <div className="pledge__main">
                  <div className="pledge__content">
                    <div className="pledge__single _show _check">
                      <h1 className="pledge__title">Данные не найдены</h1>
                      <div className="pledge__desc">
                        <p className="descrParagraph">{descriptionMkd}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
        </div>
        <Footer />
      </div>
    </>
  )
}

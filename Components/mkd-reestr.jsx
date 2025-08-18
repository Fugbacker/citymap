import React, { useState } from 'react'
import ShareButtons from './shareButtons'
import style from '../styles/File.module.css'

const MkdReestr = ({ mkdObj }) => {
  const mkdInfo = JSON.parse(mkdObj)
  const { address, built_year, cold_water_type, drainage_type,
    electrical_type, elevators_count, energy_efficiency, entrance_count, exploitation_start_year, project_type, house_type,
    is_alarm, method_of_forming_overhaul_fund, floor_count_max, floor_count_min, area_non_residential, parking_square,
    playground, sportsground, other_beautification, foundation_type, floor_type, wall_material, chute_type, chute_count,
    heating_type, hot_water_type, quarters_count, living_quarters_count, unliving_quarters_count, area_total, area_residential,
    sewerage_type, gas_type, ventilation_type, firefighting_type } = mkdInfo

  const paramInfo = {
    'Адрес многоквартирного дома:': address,
    'Код ОКАТО:': mkdInfo?.okato,
    'Код ОКТМО:': mkdInfo?.oktmo,
    'Год постройки:': built_year,
    'Ввод в эксплуатацию:': exploitation_start_year,
    'Проектная классификация:': project_type,
    'Тип постройки:': house_type,
    'Наличие в реестре аварийных домов:': is_alarm,
    'Фонд капитального ремонта:': method_of_forming_overhaul_fund,
    'Этажность здания:': floor_count_max,
    'Подъезды:': entrance_count,
    'Лифтовое оборудование:': elevators_count,
    'Энергоэффективность здания:': energy_efficiency,
    'Количество помещений:': quarters_count,
    'Количество жилых помещений (квартир):': living_quarters_count,
    'Количество нежилых помещений:': unliving_quarters_count,
    'Площадь мкд:': area_total && `${area_total} кв.м.`,
    'Суммарная площадь жилых помещений:': area_residential && `${area_residential} кв.м.`,
    'Суммарная площадь нежилых помещений:': area_non_residential && `${area_non_residential} кв.м.`,
    'Площадь парковки:': parking_square && `${parking_square} кв.м.`,
    'Детская площадка:': playground && (playground === 500 ? 'Отсутствует' : 'Есть'),
    'Спортивная площадка:': sportsground && (sportsground === 500 ? 'Отсутствует' : 'Есть'),
    'Дополнительные элементы:': other_beautification,
    'Фундамент:': foundation_type,
    'Перекрытия:': floor_type,
    'Несущие стены:': wall_material,
    'Мусоропровод:': chute_type,
    'Количество мусоропроводов:': chute_count,
    'Тип электроснабжения': electrical_type,
    'Тип теплоснабжения': heating_type,
    'Тип горячего водоснабжения': hot_water_type,
    'Тип холодного водоснобжения': cold_water_type,
    'Тип водоотведения': sewerage_type,
    'Газификация': gas_type,
    'Вентиляция': ventilation_type,
    'Наличие систем пожаротушения': firefighting_type,
    'Дренаж:': drainage_type,
  }

  const outputObject = () => {
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && paramInfo[it] !== "Не заполнено" && (
        <div key={it} className={style.object__blockTableTr}>
          <div className={style.object__blockTableTd}>{it}</div>
          <div className={style.object__blockTableTd}>{paramInfo[it]}</div>
        </div>
      )
    })
  }

  return (
    <div>
      {/* <div data-content="mkd" id="mkd-info" className="object__block"> */}
        {/* <div className="object__content-top">
          <div className="object__content-top-link ">{`Дата запроса:  ${day}.${monthReal}.${year}`}</div>
          <ShareButtons ogDescrition={ogDescrition}/>
        </div> */}
        <div data-content="mkd" id="mkd-info" className={style.object__block}>
          <div className={style["object__block-wrap"]}>
            <div className={style["object__block-title"]}><h2>Технический паспорт МКД</h2></div>
            <div className={style.techDescriptionContainer}>
              <div className={style.techDescription}>
                Технический паспорт многоквартирного дома по адресу {mkdInfo?.shortname_street || mkdInfo?.shortname_city}. {mkdInfo?.formalname_street || mkdInfo?.formalname_city}, {mkdInfo?.house_number}{mkdInfo.letter ? (`, лит. ${mkdInfo.letter}`):('')}
              </div>
            </div>
            <div className={style.object__blockTable}>
              {outputObject()}
            </div>
          </div>
        </div>
    </div>
  )
}

export default MkdReestr

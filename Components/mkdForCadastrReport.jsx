import React, { useState } from 'react'
import ShareButtons from './shareButtons'
import style from '../styles/File.module.css'

const MkdForCadastrReport = ({ dcHouse }) => {
  const mkdInfo = JSON.parse(dcHouse)
  const { area_common_property, area_land, area_non_residential, area_residential, area_total, basement_area, built_year, chute_count, chute_type, cold_water_type, drainage_type, electrical_entries_count, electrical_type, elevators_count, energy_efficiency, entrance_count, exploitation_start_year, firefighting_type, floor_count_max, floor_count_min, floor_type, foundation_type, gas_type, heating_type, hot_water_type, house_type, is_alarm, living_quarters_count, management_company, other_beautification, parking_square, playground, project_type, quarters_count, quarters_per_floor, sewerage_cesspools_volume, sewerage_type, sportsground, unliving_quarters_count, ventilation_type, wall_material } = mkdInfo?.house_info ?? {}
  const paramInfo = {
    'Год постройки:': built_year ? `${built_year}` : 'Нет данных',
    'Ввод в эксплуатацию:': exploitation_start_year ? `${exploitation_start_year}` : 'Нет данных',
    'Проектная классификация:': project_type || 'Нет данных',
    'Тип постройки:': house_type || 'Нет данных',
    'Признан аварийным:': is_alarm ? 'Да' : 'Нет',
    'Площадь мкд:': area_total && area_total !== 0 ? `${area_total} кв.м.` : 'Нет данных',
    'Этажность здания:': floor_count_max ? floor_count_max : 'Не заполнено',
    'Подъезды:': entrance_count !== null && entrance_count !== undefined ? entrance_count : 'Нет данных',
    'Количество помещений:': quarters_count ? quarters_count : 'Нет данных',
    'Количество квартир:': living_quarters_count ? living_quarters_count : 'Нет данных',
  };

  const outputObject = () => {
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && paramInfo[it] !== "Не заполнено" && (
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
        <div><h2>Технический паспорт многоквартирного дома</h2></div>
        <div style={{ display: 'table', width: '100%' }}>
          {outputObject()}
        </div>
        {/* <div style={{ textAlign: 'justify', color: '#8a95a2', fontSize: '12px', marginTop: '27px', background: '#f9f9f9', padding: '10px', fontWeight: 'bold' }}>Бесплатная информация о кадастровой стоимости объекта недвижимости носит исключительно информационный характер и может отличаться от действительной. Для того, чтобы узнать актуальную кадастровую стоимость, необходимо заказать справку о кадастровой стоимости объекта недвижимости.</div> */}
      </div>
    </>
  )
}

export default MkdForCadastrReport

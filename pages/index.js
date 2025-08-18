// pages/index.jsx
import React, { useState, useEffect, useRef } from 'react'
import { IoCheckmarkDone } from "react-icons/io5";
import axios from 'axios'
import dayjs from 'dayjs'
import { Link } from 'react-scroll'
import Head from 'next/head'
import { Search } from "../Components/search"
import { Header } from "../Components/header"
import { Footer } from "../Components/footer"
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import CheckShema from '@/Components/checkShema'
import Meta from '@/Components/meta'
import { SearchMap } from '../Components/searchMap'
import MacroRegions from '@/Components/macroRegions'
import PpkMap from '@/Components/ppkMap'
// import CadastralMap from '@/Components/testmap'
import style from '../styles/File.module.css'
import styles from '@/styles/PublicCadastralMap.module.css';
import { forbidden } from 'next/navigation'
import { FakeOrders } from '@/Components/fakeOrders'

export default function Home({ country, lat, lon, referer }) {
  const [cadastrData, setCadastrData] = useState([])
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [promoCode, setPromoCode] = useState('')
  const [error, setError] = useState(false)
  const [shema, setShema] = useState(false);
  const [type, setType] = useState(false)
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState(null)
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)
  const [checkLand, setCheckLand] = useState(false);
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    setCadastrData([])
  }, [closeChecker])

  useEffect(() => {
    setCadastrData([])
  }, [alarmMessage])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])


  useEffect(() => {
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])

  //
  // JSON-LD: main Article, sections and ItemLists
  //
  const baseUrl = 'https://cadmap.su' // поставь свой URL если нужно
  const datePublished = '11.08.2025'
  const dateModified = dayjs().format("DD.MM.YYYY")
  const mainArticleId = `${baseUrl}#main-article`

  const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": mainArticleId,
    "headline": "Публичная кадастровая карта РФ: кадастровая информация о земельных участках и улицах",
    "description": "Публичная кадастровая карта РФ — удобный интерактивный сервис по поиску кадастровой информации о любом объекте недвижимости России.",
    "author": {
      "@type": "Organization",
      "name": "CityMap",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "CityMap",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/opg1.jpg`
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": baseUrl
    },
    "articleSection": [
      "Какие сведения содержит кадастровая карта",
      "Варианты применения сведений, полученных с помощью кадастровой карты",
      "Какие отчёты можно заказать через публичную кадастровую карту",
      "Часто задаваемые вопросы по кадастровой карте",
    ],
    "url": baseUrl
  }

  // секции — каждая как Article (isPartOf -> основной)
  const sections = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-1`,
      "headline": "Публичная кадастровая карта России",
      "description": "Публичная кадастровая карта РФ — удобный интерактивный сервис по поиску кадастровой информации о любом объекте недвижимости, который внесен в Росреестр.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline": "Какие отчёты можно заказать через публичную кадастровую карту",
      "description": "Список доступных отчетов для заказа на каждый найденный на кадастровой карте объект.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-2`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline": "Часто задаваемые вопросы по кадастровой карте",
      "description": "Список вопросов с ответами по кадастровой карте.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-3`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-4`,
      "headline": "Публичная кадастровая карта регионов",
      "description": "Раздел с выбором регионов  и ссылками на кадастровые карты по субъектам РФ.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": baseUrl },
      "url": `${baseUrl}#section-7`
    }
  ]

  // ItemList'ы для всех <ul> в статье
  const itemLists = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#uses-list`,
      "name": "Сферы использования публичной кадастровой карты",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "оформления прав на недвижимость" },
        { "@type": "ListItem", "position": 2, "name": "проведения сделок с недвижимостью" },
        { "@type": "ListItem", "position": 3, "name": "налогообложения недвижимости" },
        { "@type": "ListItem", "position": 4, "name": "землеустройства" },
        { "@type": "ListItem", "position": 5, "name": "градостроительства" },
        { "@type": "ListItem", "position": 6, "name": "планирования землепользования" },
        { "@type": "ListItem", "position": 7, "name": "мониторинга объектов недвижимости" },
        { "@type": "ListItem", "position": 8, "name": "обеспечения безопасности населения и территории." }
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#purpose-list`,
      "name": "Для чего нужна публичная кадастровая карта (список)",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Упрощает получение отчетов из ЕГРН" },
        { "@type": "ListItem", "position": 2, "name": "Показывает границы земельных участков" },
        { "@type": "ListItem", "position": 3, "name": "Содержит сведения о обременениях" },
        { "@type": "ListItem", "position": 4, "name": "Показывает деления на зоны и территории" },
        { "@type": "ListItem", "position": 5, "name": "Информирует о кадастровой стоимости" }
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
        {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#how-list`,
      "name": "Как пользоваться кадастровой картой",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Поиск по кадастровому номеру" },
        { "@type": "ListItem", "position": 2, "name": "Поиск по адресу" },
        { "@type": "ListItem", "position": 3, "name": "С помощью кликов по карте" },
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#layers-list`,
      "name": "Кадастровые слои на ПКК",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Слой содержащий единицы кадастрового деления" },
        { "@type": "ListItem", "position": 2, "name": "Слой с границами земельных участков" },
        { "@type": "ListItem", "position": 3, "name": "Слой со зданиями, сооружениями и объектами незавершенного строительства" },
        { "@type": "ListItem", "position": 4, "name": "Слой с кадастровой стоимостью" },
        { "@type": "ListItem", "position": 5, "name": "Слой с зонами и территориями" }
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#objects-list`,
      "name": "Объекты на публичной кадастровой карте",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Единицы кадастрового деления с зонами и территориями" },
        { "@type": "ListItem", "position": 2, "name": "Земельные участки" },
        { "@type": "ListItem", "position": 3, "name": "Здания, сооружения и объекты незавершенного строительства" }
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    }
  ]

  const jsonLdObjects = [mainArticle, ...sections, ...itemLists]

  return (
    <>
      <Head>
        {jsonLdObjects.map((obj, i) => (
          <script
            key={i}
            type="application/ld+json"
            // prettier-ignore
            dangerouslySetInnerHTML={{ __html: JSON.stringify(obj, null, 2) }}
          />
        ))}
      </Head>

      <Meta
        title={`Кадастровая карта 2025 РФ с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов России на кадастровой карте`}
        descritoin={`Публичная кадастровая карта России с кадастровыми сведениями о земельных участках и улицах с нумерацией домов всех регионов России`}
        keywords={`публичная кадастровая карта 2025, официальная кадастровая карта, кадастровая карта, публичная кадастровая карта 2025, новая публичная кадастровая карта, кадастровая карта НСПД, пкк НСПД, публичная кадастровая карта РФ`}
        canonicalURL={`https://cadmap.su`}
        robots='index, follow'
        ogUrl={`https://cadmap.su`}
        ogTitle={`Кадастровая карта 2025 РФ с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов России на кадастровой карте`}
        ogDescrition={`Публичная кадастровая карта России с кадастровыми сведениями о земельных участках и улицах с нумерацией домов всех регионов России`}
        twitterTitle={`Кадастровая карта 2025 РФ с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов России на кадастровой карте`}
        twitterDescription={`Публичная кадастровая карта России с кадастровыми сведениями о земельных участках и улицах с нумерацией домов всех регионов России`}
      />
      <Header />
      <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            <h1>Публичная кадастровая карта РФ: кадастровая информация о земельных участках и улицах с нумерацией домов любого населенного пункта России</h1>
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                <p>Кадастровая карта - поиск кадастровой информации о всех земельных участках с нумерацией домов на улицах каждого населенного пункта РФ.</p>
              </div>
              <div className={style.servicePictureCad}></div>
            </div>
            <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} referer={referer} error={error} setError={setError} type={type} setType={setType}/>
        </div>
      </div>
      {alarmMessage &&
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
          <div className={style.repairBlock}>
            <div className={style["object__block-wrap"]}>
              <div className={style.repairInfo}>
                <p>Не удалось загрузить данные по объекту, серверы кадастровой карты перегружены. Попробуйте произвести поиск чуть позже.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
      <map>
        <div className={`${style.section} ${style.services}`}>
          <div className={style.content1}>
            <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} type={type} setType={setType} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand} />

            {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
            {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
          </div>
        </div>
      </map>
      {!baloonData &&
        <>
        <main>
          <article id="main-article" itemScope itemType="https://schema.org/Article" itemProp="mainContentOfPage">
          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-title"]}><h2>Публичная кадастровая карта России</h2></div>
                    <section id="section-1" itemProp="articleBody" className={styles.section}>
                      <div className={style.contentText}>
                      <p>Публичная кадастровая карта РФ — удобный интерактивный сервис по поиску кадастровой информации о любом объекте недвижимости, который внесен в Росреестр.</p>
                      <h2>Какие сведения содержит кадастровая карта?</h2>
                      <p>Интерактивная карта доступна в режиме реального времени и позволяет пользователям получать актуальную информацию о недвижимости. Кадастровая карта России позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                      <ul>
                        <li>Информацию о местоположении объекта невдижимости</li>
                        <li>Уточненные границы участка</li>
                        <li>Факт межевания участка</li>
                        <li><Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                        <li><Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                        <li>Технические сведения земельного участка или ОКС</li>
                        <li>Назначение и категорию земель</li>
                        <li>Разрешённое использование земель</li>
                        <li>Тип собственности</li>
                      </ul>
                      <h2>Варианты применения сведений, полученных с помощью кадастровой карты</h2>
                      <p>Информация на публичной кадастровой карте используется в различных целях, в том числе для:</p>
                      <ul className={style.govy1} id="uses-list">
                      <li>проведения сделок с недвижимостью;</li>
                      <li>оформления прав на недвижимость;</li>
                      <li>формирование налогооблагаемой базы;</li>
                      <li>градостроительства;</li>
                      <li>землеустройства;</li>
                      <li>планирования землепользования;</li>
                      <li>мониторинга избранных объектов недвижимости;</li>
                      <li>обеспечения безопасности населения и территории.</li>
                      </ul>
                    </div>
                  </section>
                </div>
              </div>
          </div>

          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-title"]}><h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2></div>
                    <section id="section-2" itemProp="articleBody" className={styles.section}>
                      <p>Кадастровая карта позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
                      <table itemScope itemType="https://schema.org/Table">
                        <thead>
                          <tr>
                            <th>Отчёт</th>
                            <th>Содержание</th>
                            <th>Рекомендации</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td data-label="Отчёт"><b>Сводный земельный отчёт</b></td>
                            <td data-label="Содержание">Содержит сведения о возможных пересечениях зон ограничений использования территорий (ЗОУИТ), а так же сведения о пересечениях с другими участками.</td>
                            <td data-label="Рекомендации">Требуется для выявления пересечений</td>
                          </tr>
                          <tr>
                            <td data-label="Отчёт"><b>Отчёт об основных характеристиках объекта</b></td>
                            <td data-label="Содержание">Содержит общую техническую информацию, сведения о виде собственника (юридическое или физическое лицо), данные об ограничениях, обременениях, арестах.</td>
                            <td data-label="Рекомендации">Необходим для проверки недвижимости</td>
                          </tr>
                          <tr>
                            <td data-label="Отчёт"><b>Отчёт о переходе прав</b></td>
                            <td data-label="Содержание">Содержит историю изменений собственников, без ФИО.</td>
                            <td data-label="Рекомендации">Необходим для проверки недвижимости</td>
                          </tr>
                          <tr>
                            <td data-label="Отчёт"><b>Справка о кадастровой стоимости</b></td>
                            <td data-label="Содержание">Подтверждающий документ с актуальной кадастровой стоимостью для использования в сделках и оценках.</td>
                            <td data-label="Рекомендации">Требуется для формирования налогоблагаемой базы</td>
                          </tr>
                        </tbody>
                      </table>
                  </section>
                </div>
              </div>
          </div>

          <div className={`${style.section} ${style.services}`}>
            <div className={style.content1}>
                <div className={style.object__block}>
                  <div className={style["object__block-title"]}><h2>Вопросы по кадастровой карте</h2></div>
                      <section id="section-3" className={styles.section} itemScope itemType="https://schema.org/FAQPage">
                        {[
                          {
                            question: <h2>Как пользоваться публичной кадастровой картой</h2>,
                            answer:
                              <ul className={style.govy1} id="how-list">
                                <li>с помощью поиска объекта по кадастровому номеру;</li>
                                <li>с помощью поиска объекта по адресу;</li>
                                <li>с помощью кликов по кадастровой карте;</li>
                              </ul>,
                          },
                          {
                            question: <h2>Для чего нужна публичная кадастровая карта</h2>,
                            answer:
                            <>
                              <p>Публичная кадастровая карта России упрощает поиск информации об объекта недвижимости, а так же:</p>
                              <ul className={style.govy1} id="purpose-list">
                                <li>Показывает границы земельных участков;</li>
                                <li>Упрощает получение отчетов из ЕГРН;</li>
                                <li>Помогает определить тип собственности;</li>
                                <li>Показывает территориальное зонирование;</li>
                                <li>Содержит сведения о кадастровой стоимости;</li>
                              </ul>
                            </>
                          },
                          {
                            question: <h2>Какие кадастровые слои используются на ПКК</h2>,
                            answer:
                            <>
                              <p>В качестве основной подложки сервис испрользует карту Яндекса, на которую наложены слои с кадастровыми сведениями и делениями. Всего таких слоев пять:</p>
                              <ul className={style.govy1} id="layers-list">
                                <li>Слой содержащий единицы кадастрового деления;</li>
                                <li>Слой, отображающий границы земельных участков;</li>
                                <li>Слой, отображающий границы домов;</li>
                                <li>Слой, выводящий информацию о кадастровой стоимости</li>
                                <li>Слой с зонами и территориями;</li>
                              </ul>
                              <p>Каждый кадастровый слой содержит определенную информацию, как визуального, так и технического типа.</p>
                            </>,
                          },
                          {
                            question: <h2>Какие объекты расположены на публичной кадастровой карте?</h2>,
                            answer:
                            <>
                              <ul className={style.govy1} id="objects-list">
                                <li>Единицы кадастрового деления с зонами и территориями;</li>
                                <li>Земельные участки;</li>
                                <li>Здания, сооружения и объекты незавершенного строительства;</li>
                              </ul>
                            </>,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={styles['faq-item']}
                            itemProp="mainEntity"
                            itemScope
                            itemType="https://schema.org/Question"
                          >
                            <h3
                              onClick={() => toggleFAQ(i)}
                              className={`${styles['faq-question']} ${activeIndex === i ? 'active' : ''}`}
                              itemProp="name"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') toggleFAQ(i);
                              }}
                            >
                              <IoCheckmarkDone /> {item.question}
                            </h3>
                            <div
                              className={styles['faq-answer']}
                              itemProp="acceptedAnswer"
                              itemScope
                              itemType="https://schema.org/Answer"
                              style={{ display: activeIndex === i ? 'block' : 'none' }}
                            >
                              <p itemProp="text">{item.answer}</p>
                            </div>
                          </div>
                        ))}
                      </section>
                </div>
              </div>
          </div>
        </article>
        <section id="section-4">
            <div className={`${style.section} ${style.services}`}>
              <div className={style.content1}>
                  <div className={style.object__block}>
                    <div className={style["object__block-title"]}><h2>Публичная кадастровая карта регионов</h2></div>
                      <MacroRegions />
                  </div>
                </div>
            </div>
        </section>
        </main>
        </>
      }
        <Footer />
    </>
  )
}



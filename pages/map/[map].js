import { useState, useEffect } from 'react'
import { TbPointFilled } from "react-icons/tb";
import { IoCheckmarkDone } from "react-icons/io5";
import Head from 'next/head'
import Link from 'next/link';
import axios from 'axios'
import dayjs from "dayjs";
import { useRouter } from 'next/router'
import { cityIn, cityFrom, cityTo } from 'lvovich';
import { Search } from '@/Components/search'
import { Header } from "@/Components/header"
import { Footer } from "@/Components/footer"
import Scroll from '@/Components/scroll'
import CheckRaports from '@/Components/checkRaports'
import Meta from '@/Components/meta'
import  { SearchMap }  from '@/Components/searchMap'
import CheckShema from '@/Components/checkShema'
import { MongoClient } from 'mongodb'
import MacroRegions from '@/Components/macroRegions'
import macroRegions from '@/Components/files/macroRegions'
import regionsRus from '@/Components/files/rusRegions';
import rusRegions from '@/Components/files/regionsWithNumber'
import PpkMap from '@/Components/ppkMap'
import AroundObjects from '@/Components/aroundObjects'
import { FakeOrders } from '@/Components/fakeOrders'
import style from '@/styles/File.module.css'
import styles from '@/styles/PublicCadastralMap.module.css';


const url = process.env.MONGO_URL
// const client = new MongoClient(url, { useUnifiedTopology: true })
const client = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true })
const clientPromise = client.connect()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

async function getDatabase() {
  try {
    await clientPromise; // ждём подключение

    // Проверим, что коннект живой
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Подключение к MongoDB установлено");

    return client.db(process.env.MONGO_COLLECTION);
  } catch (err) {
    console.error("❌ Ошибка подключения к MongoDB:", err);
    throw err;
  }
}



export default function Home({ cities, districts, regionName, regionCode, regionStat, center, regionNumber, list, districtData, city, settlement, region, macroRegionNameGenetive, settlementName, field, streetArray, street, houseArray, streetName, house, cadNumber }) {
  const citiesList = cities && JSON.parse(cities)
  const districtsList = districts && JSON.parse(districts)
  const stats = regionStat && JSON.parse(regionStat)
  const districtStats = districtData && JSON.parse(districtData)
  const lat = center && JSON.parse(center)[0]
  const lon = center && JSON.parse(center)[1]
  const zoomLevel = center && JSON.parse(center)[2]
  const [cadastrData, setCadastrData] = useState([])
  const [cadastrNumber, setCadastrNumber] = useState('')
  const [isVisible, setIsVisible] = useState(true);
  const [onCkickCadastrNumber, setOnCkickCadastrNumber] = useState('')
  const [closeChecker, setCloseChecker] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState(false)
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [error, setError] = useState(false)
  const [flatRights, setFlatRights] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [activate, setActivate] = useState(false)
  const [loading, setLoading] = useState(false);
  const [baloonData, setBaloonData] = useState('');
  const [sendActivePromoCode, SetSendActivePromoCode] = useState('')
  const [isCurrentlyDrawing, setIsCurrentlyDrawing] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState(null);
  const [isEditingPolygon, setIsEditingPolygon] = useState(false);
  const [shema, setShema] = useState(false);
  const [checkLand, setCheckLand] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const rights = flatRights?.realty?.rights
  const rightsCheck = rights?.filter((it) =>  it?.rightState === 1)
  const cityList = list && JSON.parse(list).sort()
  const streetList = streetArray && JSON.parse(streetArray).sort()
  const houseList = houseArray && JSON.parse(houseArray).sort()
  const cityes = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim().toLowerCase();
    return /^(?:г\.|город)/.test(name);
  });

  const villages = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim().toLowerCase();
    return /^(д\.|с\.|с\/с)\s/.test(name);
  });



  const settlements = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim().toLowerCase();
    return /^п\.\s/.test(name);
  });

  const territories = cityList?.filter(it => {
    if (!it.name) return false;
    const name = it.name.trim().toLowerCase();
    return /^(тер\.?\s?|территория\s|снт\.?\s?|гск\.?\s?|днт\.?\s?|тсн\.?\s?|жск\.?\s?)/.test(name);
  });

const otherLocality = cityList?.filter(it => {
  if (!it.name) return false;
  const name = it.name.trim().toLowerCase();

  const isVillage = /^(д\.|с\.|с\/с)\s/.test(name);
  const isSettlement = /^п\.\s/.test(name);
  const isTerritory = /^(тер\.?\s?|территория\s|снт\.?\s?|гск\.?\s?|днт\.?\s?|тсн\.?\s?|жск\.?\s?)/.test(name);

  return !isVillage && !isSettlement && !isTerritory;
});

  // const aroundObjects = field && JSON.parse(field)
  const baseRegionId = macroRegions.find(it => it.key === Number(regionNumber))?.id
  const router = useRouter()
  const path = router?.asPath

  const genetiveRegionName = macroRegions?.find((it => it.name === regionName))?.genitive || macroRegions?.find((it => it.key === parseInt(regionNumber)))?.genitive

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    setCadastrData([])
  }, [closeChecker])

  useEffect(() => {
    if (cadNumber) {
      setCadastrNumber([cadNumber])
    }
  }, [cadNumber])

  useEffect(() => {
    setCadastrData([])
  }, [alarmMessage])

  useEffect(() => {
    SetSendActivePromoCode(promoCode)
  }, [activate])

  const showNotification = () => {
    setIsNotificationVisible(true);
  };

  const hideNotification = () => {
    setIsNotificationVisible(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNotification();
      setTimeout(() => {
        hideNotification();
      }, 7000); // Устанавливаем время показа уведомления (в миллисекундах)
    }, Math.floor(Math.random() * 11000) + 25000); // Рандомный интервал от 10 до 20 секунд

    return () => clearInterval(interval);
  }, []);


  const askAboutRights = async () => {
    const askObjectId = await axios(`/api/findId?cadNumber=${cadastrNumber}`)
    const objectId = askObjectId?.data
    if (objectId !== 0 && typeof objectId !== null) {
      const r = await axios(`/api/findRights?objectid=${objectId}&cadNumber=${cadastrNumber}`)
      if (typeof r !== null) {
        setFlatRights(r.data)
        return
      }
      setFlatRights('error')
      return
    }
    setFlatRights('error')
 }

  useEffect(() => {
    // askAboutRights()
    setActivate(false)
    SetSendActivePromoCode('')
  }, [cadastrNumber])

  const baseUrl = 'https://cadmap.su' // поставь свой URL если нужно
  const datePublished = '11.08.2025'
  const dateModified = dayjs().format("DD.MM.YYYY")
  const mainArticleId = `${baseUrl}#main-article`


    const mainArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": mainArticleId,
    "headline":
     cities ? `Публичная кадастровая карта ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц` :
     region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц` :
     city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов` :
     settlement ? `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов` : `Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 c нумерацией домов`,
    "description":
     cities ? `Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${genetiveRegionName} 2025` :
     region ? `Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} 2025` :
     city ? `Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(regionName)} ${genetiveRegionName} 2025` :
     settlement ? `Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025` : `Публичная кадастровая карта земельных участков и домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025`,
    "author": {
      "@type": "Organization",
      "name": "CityMap",
      "url": `${baseUrl}/${path}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "CityMap",
      "url": `${baseUrl}/${path}`,
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${path}`
    },
    "articleSection": [
      cities ? `Какие сведения содержит кадастровая карта ${genetiveRegionName}` :
      region ? `Какие сведения содержит кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Какие сведения содержит кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}` :
      settlement ? `Какие сведения содержит кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Какие сведения содержит кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Какие отчёты можно заказать через публичную кадастровую карту ${genetiveRegionName}` :
      region ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(regionName)} ${genetiveRegionName}` :
      settlement ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Статистика публичной кадастровой карты ${genetiveRegionName}` :
      region ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName}` :
      settlement ? `Статистика публичной кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Статистика публичной кадастровой карты ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      cities ? `Часто задаваемые вопросы по кадастровой карте ${genetiveRegionName}` :
      region ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
      city ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :
      settlement ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Часто задаваемые вопросы по кадастровой карте ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
    ],
    "url": `${baseUrl}/${path}`
  }

  // секции — каждая как Article (isPartOf -> основной)
  const sections = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-1`,
      "headline":
        cities ? `Публичная кадастровая карта ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц` :
        region ? `Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц` :
        city ? `Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов` :
        settlement ? `Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов` : `Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 c нумерацией домов`,
      "description":
        cities ? `Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${genetiveRegionName} 2025` :
        region ? `Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} 2025` :
        city ? `Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(regionName)} ${genetiveRegionName} 2025` :
        settlement ? `Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025` : `Публичная кадастровая карта земельных участков и домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}`},
      "url": `${baseUrl}/${path}#section-1`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-2`,
      "headline":
        cities ? `Какие отчёты можно заказать через публичную кадастровую карту ${genetiveRegionName}` :
        region ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Какие отчёты можно заказать через публичную кадастровую карту ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Список доступных отчетов для заказа на каждый найденный на кадастровой карте ${genetiveRegionName} объект` :
        region ? `Список доступных отчетов для заказа на каждый найденный на кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName} объект` :
        city ? `Список доступных отчетов для заказа на каждый найденный на кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName} объект` :
        settlement ? `Список доступных отчетов для заказа на каждый найденный на кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} объект` : `Список доступных отчетов для заказа на каждый найденный на кадастровой карте ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} объект`,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}}#section-2`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-3`,
      "headline":
        cities ? `Статистика публичной кадастровой карты ${genetiveRegionName}` :
        region ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Статистика публичной кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Статистика публичной кадастровой карты ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Сводная статистическая кадастровая информация ${genetiveRegionName}` :
        region ? `Сводная статистическая кадастровая информация ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Сводная статистическая кадастровая информация ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Сводная статистическая кадастровая информация ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Сводная статистическая кадастровая информация ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-3`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-4`,
      "headline":
        cities ? `Часто задаваемые вопросы по кадастровой карте ${genetiveRegionName}` :
        region ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Часто задаваемые вопросы по кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Часто задаваемые вопросы по кадастровой карте ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "description":
        cities ? `Список вопросов с ответами по кадастровой карте ${genetiveRegionName}` :
        region ? `Список вопросов с ответами по кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Список вопросов с ответами по кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Список вопросов с ответами по кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Список вопросов с ответами по кадастровой карте ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-4`
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${mainArticleId}#section-5`,
      "headline":
        cities ? `Публичная кадастровая карта населенных пунктов ${genetiveRegionName}` :
        region ? `Публичная кадастровая карта населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Публичная кадастровая карта населенных пунктов ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Публичная кадастровая карта улиц ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Публичная кадастровая карта домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "description": "Раздел с выбором регионов  и ссылками на кадастровые карты по субъектам РФ.",
      "isPartOf": { "@type": "Article", "@id": mainArticleId },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${baseUrl}/${path}` },
      "url": `${baseUrl}/${path}#section-5`
    }
  ]

  // ItemList'ы для всех <ul> в статье
  const itemLists = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#listData`,
      "name":
        cities ? `Какие сведения содержит кадастровая карта ${genetiveRegionName}` :
        region ? `Какие сведения содержит кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Какие сведения содержит кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Какие сведения содержит кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Какие сведения содержит кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Фактический адрес объекта недвижимости" },
        { "@type": "ListItem", "position": 2, "name": "Кадастровую стоимость земельного участка или объекта капитального строительства (ОКС)" },
        { "@type": "ListItem", "position": 3, "name": "Кадастровый номер" },
        { "@type": "ListItem", "position": 4, "name": "Назначение и категорию земель" },
        { "@type": "ListItem", "position": 5, "name": "Разрешённое использование земель" },
        { "@type": "ListItem", "position": 6, "name": "Тип собственности" }
      ],
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${mainArticleId}#statData`,
      "name":
        cities ? `Статистика публичной кадастровой карты ${genetiveRegionName}` :
        region ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName}` :
        city ? `Статистика публичной кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName}` :
        settlement ? `Статистика публичной кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}` : `Статистика публичной кадастровой карты ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}`
      ,
      "itemListElement":[
        cities ? [
        { "@type": "ListItem", "position": 1, "name": "количество кадастровых районов" },
        { "@type": "ListItem", "position": 2, "name": "количество кадастровых кварталов" },
        { "@type": "ListItem", "position": 3, "name": "количество домов и зданий" },
        { "@type": "ListItem", "position": 4, "name": "количество земельных участков" },
      ] :
      region ? [
        { "@type": "ListItem", "position": 1, "name": "количество кадастровых кварталов" },
        { "@type": "ListItem", "position": 2, "name": "количество населенных пунктов" },
        { "@type": "ListItem", "position": 3, "name": "количество домов и зданий" },
        { "@type": "ListItem", "position": 4, "name": "количество земельных участков" },
      ] :
      city ? [
        { "@type": "ListItem", "position": 1, "name": "количество населенных пунктов" },
        { "@type": "ListItem", "position": 2, "name": "количество улиц" },
      ] :
      settlement ? [
        { "@type": "ListItem", "position": 1, "name": "количество улиц" },
      ] : [
        { "@type": "ListItem", "position": 1, "name": "количество домов" },
      ]
    ]
            ,
      "isPartOf": { "@type": "Article", "@id": mainArticleId }
    },
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
      {cities && <Meta
        title={`Публичная кадастровая карта ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов ${genetiveRegionName} на кадастровой карте`}
        descritoin={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${genetiveRegionName}.`}
        keywords={`публичная кадастровая карта 2025 ${genetiveRegionName}, кадастровая карта ${genetiveRegionName} 2025, кадастровая карта ${genetiveRegionName}, публичная кадастровая карта ${genetiveRegionName}, деревни, поселки, хутора, села, города ${genetiveRegionName}`}
        canonicalURL={`https://cadmap.su/${path}`}
        robots='index, follow'
        ogUrl={`https://cadmap.su/${path}`}
        ogTitle={`Публичная кадастровая карта ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов ${genetiveRegionName} на кадастровой карте`}
        ogDescrition={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${genetiveRegionName}.`}
        twitterTitle={`Публичная кадастровая карта ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц | Земельные участки и дома населенных пунктов ${genetiveRegionName} на кадастровой карте`}
        twitterDescription={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${genetiveRegionName}.`}
      />}
      {region &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц |Земельные участки и дома населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте.`}
          descritoin={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          keywords={`публичная кадастровая карта 2025 ${cityFrom(regionName)} района ${genetiveRegionName}, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName}, деревни, поселки, хутора, села ${cityFrom(regionName)} района ${genetiveRegionName}`}
          canonicalURL={`https://cadmap.su/${path}`}
          robots='index, follow'
          ogUrl={`https://cadmap.su/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц |Земельные участки и дома населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте.`}
          ogDescrition={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями населенных пунктов и улиц |Земельные участки и дома населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте.`}
          twitterDescription={`Публичная кадастровая карта земельных участков, улиц и домов населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Нумерация домов и земельных участков, название улиц населенных пунктов ${cityFrom(regionName)} района ${genetiveRegionName}.`}
        />
      }

      {city &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов|Земельные участки с нумерацией домов на улицах ${cityFrom(regionName)} ${genetiveRegionName} на кадастровой карте.`}
          descritoin={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(regionName)} ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(regionName)} ${genetiveRegionName}.`}
          keywords={`публичная кадастровая карта 2025 ${cityFrom(regionName)} ${genetiveRegionName}, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName}, название улиц, нумерация домов ${cityFrom(regionName)} ${genetiveRegionName}`}
          canonicalURL={`https://cadmap.su/${path}`}
          robots='index, follow'
          ogUrl={`https://cadmap.su/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов|Земельные участки с нумерацией домов на улицах ${cityFrom(regionName)} ${genetiveRegionName} на кадастровой карте.`}
          ogDescrition={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(regionName)} ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(regionName)} ${genetiveRegionName}.`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов|Земельные участки с нумерацией домов на улицах ${cityFrom(regionName)} ${genetiveRegionName} на кадастровой карте.`}
          twitterDescription={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(regionName)} ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(regionName)} ${genetiveRegionName}.`}
        />
      }

      {settlement &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов | Земельные участки с нумерацией домов на улицах ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          descritoin={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          keywords={`публичная кадастровая карта 2025 ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName} 2025, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, публичная кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, название улиц, нумерация домов ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}`}
          canonicalURL={`https://cadmap.su/${path}`}
          robots='index, follow'
          ogUrl={`https://cadmap.su/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов | Земельные участки с нумерацией домов на улицах ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          ogDescrition={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 с названиями улиц и нумерацией домов | Земельные участки с нумерацией домов на улицах ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          twitterDescription={`Публичная кадастровая карта земельных участков, улиц и домов ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Земельные участки с нумерацией домов и название улиц ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
        />
      }

      {street &&
        <Meta
          title={`Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 c нумерацией домов | Земельные участки с нумерацией домов на ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          descritoin={`Публичная кадастровая карта земельных участков и домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Границы земельных участков с нумерацией домов по ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          keywords={`публичная кадастровая карта 2025 ${cityFrom(streetName)} ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, кадастровая карта ${cityFrom(streetName)} ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName} 2025, кадастровая карта ${cityFrom(streetName)} ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}, нумерация домов ${cityFrom(streetName)} ${cityFrom(regionName)} района ${genetiveRegionName} ${genetiveRegionName}`}
          canonicalURL={`https://cadmap.su/${path}`}
          robots='index, follow'
          ogUrl={`https://cadmap.su/${path}`}
          ogTitle={`Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 c нумерацией домов | Земельные участки с нумерацией домов на ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          ogDescrition={`Публичная кадастровая карта земельных участков и домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Границы земельных участков с нумерацией домов по ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
          twitterTitle={`Публичная кадастровая карта ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025 c нумерацией домов | Земельные участки с нумерацией домов на ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} на кадастровой карте`}
          twitterDescription={`Публичная кадастровая карта земельных участков и домов ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} 2025. Границы земельных участков с нумерацией домов по ${cityFrom(streetName)} ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`}
        />
      }
      <Header />
       <div className={`${style.section} ${style.content1} ${style.blue}`}>
          <div className={style.content1}>
            {cities ? <h1>Публичная кадастровая карта {genetiveRegionName}: список городов, деревень, сёл, аулов, хуторов, станиц и поселков. Кадастровые сведения о всех земельных участках и домов любого населенного пункта {genetiveRegionName}.</h1>:
            region ? <h1>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName}: деревни, села, аулы, хутора, станицы и поселки. Кадастровые сведения о всех земельных участках и домах любого населенного пункта {cityFrom(regionName)}.</h1>:
            city ? <h1>Публичная кадастровая карта {cityFrom(regionName)} {genetiveRegionName}: название улиц с нумерацией домов. Поиск кадастровые сведения о всех земельных участках и домах любой улицы {cityFrom(regionName)}.</h1>:
            settlement ? <h1>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}: название улиц с нумерацией домов. Кадастровые сведения о всех земельных участках и домах любой улицы {cityFrom(settlementName)}.</h1>:
            <h1>Публичная кадастровая карта {cityFrom(streetName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} с нумерацией домов. Кадастровые сведения о всех земельных участках и домах по {cityFrom(streetName)}.</h1>
            }
            <div className={style.serviceItem}>
              <div className={style.serviceText}>
                {cities ?
                <p>Публичная кадастровая карта {genetiveRegionName} - поиск кадастровой информации о всех земельных участках с нумерацией домов на улицах каждого населенного пункта {genetiveRegionName}.</p>:
                region ? <p>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} - поиск кадастровой информации о всех земельных участках с нумерацией домов на улицах каждого населенного пункта {cityFrom(regionName)}.</p>:
                city ? <p>Публичная кадастровая карта города {cityFrom(regionName)} {genetiveRegionName} - поиск кадастровой информации о всех земельных участках с нумерацией домов на улицах {cityFrom(regionName)}.</p>:
                settlement ? <p>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} - поиск кадастровой информации о всех земельных участках с нумерацией домов на улицах {cityFrom(regionName)}.</p>:
                <p>Публичная кадастровая карта {cityFrom(streetName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} - поиск кадастровой информации о всех земельных участках с нумерацией домов на улице {cityFrom(streetName)}.</p>
                }
              </div>
              <div className={style.servicePictureCad}></div>
            </div>
          <SearchMap setCadastrData={setCadastrData} cadastrData={cadastrData} setCadastrNumber={setCadastrNumber} closeChecker={closeChecker} alarmMessage={alarmMessage} setAlarmMessage={setAlarmMessage} setBaloonData={setBaloonData} error={error} setError={setError} />
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
      <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
          <PpkMap cadastrNumber={cadastrNumber} setCloseChecker={setCloseChecker} setAlarmMessage={setAlarmMessage} setCadastrNumber={setCadastrNumber} flatRights={flatRights} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} lat={lat} lon={lon} closeChecker={closeChecker} setLoading={setLoading} loading={loading} setBaloonData={setBaloonData} baloonData={baloonData} onCkickCadastrNumber={onCkickCadastrNumber} setOnCkickCadastrNumber={setOnCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} error={error} setError={setError} setIsCurrentlyDrawing={setIsCurrentlyDrawing} isCurrentlyDrawing={isCurrentlyDrawing} setPolygonCoordinates={setPolygonCoordinates} polygonCoordinates={polygonCoordinates} setIsEditingPolygon={setIsEditingPolygon} isEditingPolygon={isEditingPolygon} setShema={setShema} shema={shema} setCheckLand={setCheckLand} checkLand={checkLand} zoomLevel={zoomLevel}/>

          {!shema && (cadastrNumber || onCkickCadastrNumber) && !loading &&<CheckRaports cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} setIsVisible={setIsVisible} isVisible={isVisible} checkLand={checkLand} />}
          {(!isCurrentlyDrawing && polygonCoordinates && !isEditingPolygon && shema) && <CheckShema cadNum={cadastrNumber} owner={rights} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate} onCkickCadastrNumber={onCkickCadastrNumber} polygonCoordinates={polygonCoordinates} />}
        </div>
      </div>
  { !baloonData &&
    <>
      {citiesList &&<div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
                <div className={style["object__block-title"]}><h2>Публичная кадастровая карта {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                      <section itemProp="articleBody" className={styles.section} id="section-1">
                        <p>Публичная кадастровая карта {genetiveRegionName} - удобный инструмент, который позволяет в интерактивном режиме получить кадастровые сведения по любому земельному участку, зданию и сооружению, которые внесены в единый госуарственный реестр недвижимости. Следует отметить, если межевание земельного участка не произведено, то поулчить кадастровые сведения по такому участку не удастся.</p>

                        <h2>Какие сведения содержит кадастровая карта?</h2>
                        <p>Кадастровая карта {genetiveRegionName} позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                        <ul id="listData">
                          <li><TbPointFilled /> Фактический адрес объекта недвижимости</li>
                          <li><TbPointFilled /> <Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                          <li><TbPointFilled /> <Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                          <li><TbPointFilled /> Назначение и категорию земель</li>
                          <li><TbPointFilled /> Разрешённое использование земель</li>
                          <li><TbPointFilled /> Тип собственности</li>
                        </ul>
                      </section>

                      <section className={styles.section} itemProp="articleBody" id="section-2">
                        <h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2>
                        <p>Кадастровая карта {genetiveRegionName} позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
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

                      <section className={styles.section} itemProp="articleBody" id="section-3">
                        <h2>Статистика публичной кадастровой карты</h2>
                        <p>По данным Росреестра и НСПД, на {dayjs().format("DD.MM.YYYY")} кадастровая карта {genetiveRegionName} включает в себя:</p>
                        <ul id="statData">
                          <li><TbPointFilled />{stats?.rayon?.total} кадастровых районов, из них с границами — {stats?.rayon?.geo}</li>
                          <li><TbPointFilled />{stats?.kvartal?.total} кадастровых кварталов, из них с границами — {stats?.kvartal?.geo}</li>
                          <li><TbPointFilled />{stats?.oks?.total} объектов капитального строительства, из них с границами — {stats?.oks?.geo}</li>
                          <li><TbPointFilled />{stats?.parcel?.total} земельных участков, из них с границами — {stats?.parcel?.geo}</li>
                        </ul>
                      </section>

                      <section className={styles.section} itemScope itemType="https://schema.org/FAQPage" id="section-4">
                        <h2>Часто задаваемые вопросы</h2>
                        {[
                          {
                            question: 'Можно ли получить кадастровую информацию по неразмежеванному участку?',
                            answer: `Нет, сведения по участкам ${genetiveRegionName} без межевания в публичной кадастровой карте отсутствуют, так как такие участки не зарегистрированы в ЕГРН.`,
                          },
                          {
                            question: `Как часто обновляются данные кадастровой карты?`,
                            answer: `Данные кадастровой карты ${genetiveRegionName} обновляются автоматически после каждого внесения изменений в Росреестр, в среднем данная процедура занимает 3-7 рабочих дней.`,
                          },
                          {
                            question: `Как можно проверить актуальность данных публичной кадастровой карты?`,
                            answer: `Сервис публичной кадастровой карты ${genetiveRegionName} содержит актуальные сведения на дату запроса информации. Однако, следует отметить, что в момент отображения сведений могут происходить внесение изменений в Росреестр. Максимально актуальные сведения будут содержаться в отчете об основных характеристиках, а также в справке о кадастровой стоимости.`,
                          },
                          {
                            question: `Почему участок не отображается на кадастровой карте?`,
                            answer: `На публичной кадастровой карте ${genetiveRegionName} отображаются только участки, прошедшие межевание. Если участок не отображается на карте, значит он не прошел межевание, либо данные еще не были актуализированы. Для проверки можно заказать отчет об основных характеристиках участка.`,
                          },
                          {
                            question: `Что такое межевание?`,
                            answer: `Межевание — это процедура, когда кадастровый инженер выезжает на участок, определяет координаты углов, фиксирует границы участка, подписывает акт с соседями и подготавливает документы (межевой план) для подачи в орган регистрации прав. После того, как будет проведена процедура межевания, участок будет отображаться на карте ${genetiveRegionName}.`,
                          },
                          {
                            question: `Почему дом или здание не отображается на карте?`,
                            answer: `Аналогично с участками, кадастровая карта ${genetiveRegionName} отображает только те дома, которые прошли межевание и встали на кадастровый учет в Росреестре.`,
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

                            {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
                    </article>
               <section id="section-5">
                <div className={style.regionsContainer}>
                  <h2>Города и городские округа {genetiveRegionName}</h2>
                  <div className={style.houseDescription}>
                    <p>
                      {citiesList.length} городов с названиями улиц и нумерацией домов на кадастровой карте {genetiveRegionName}.
                    </p>
                  </div>
                  {citiesList.map((it, index) => {
                    return (
                    <Link href={`/map/${regionNumber}_${it.id}`} className={style.regionName} key={index}>
                      <div className={style.statRegionContainer}>
                        <div className={style.name}>{it.name}</div>
                      </div>
                    </Link>
                      )
                    })
                  }
                  <h2>Кадастровые районы {genetiveRegionName}</h2>
                  <div className={style.houseDescription}>
                    <p>
                      {districtsList.length} районов с названием населенных пунктов на кадастровой карте {genetiveRegionName}.
                    </p>
                  </div>
                  {districtsList.map((it, index) => {
                    return (
                      <Link href={`/map/${regionNumber}-${it.id}`} className={style.regionName} key={index}>
                        <div className={style.statRegionContainer}>
                          <div className={style.name}>{it.name}</div>
                        </div>
                      </Link>
                      )
                    })
                  }
                </div>
              </section>
            </div>
          </div>
      </div>}
      {region && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                  <section itemProp="articleBody" className={styles.section} id="section-1">
                    <p>Публичная кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} - удобный инструмент, который позволяет в интерактивном режиме получить кадастровые сведения по любому земельному участку, зданию и сооружению, которые внесены в единый госуарственный реестр недвижимости. Следует отметить, если межевание земельного участка {cityFrom(regionName)} не произведено, то поулчить кадастровые сведения по такому участку не удастся.</p>

                    <h2>Какие сведения содержит кадастровая карта?</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                   <ul id="listData">
                      <li><TbPointFilled /> Фактический адрес объекта недвижимости</li>
                      <li><TbPointFilled /> <Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                      <li><TbPointFilled /> <Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                      <li><TbPointFilled /> Назначение и категорию земель</li>
                      <li><TbPointFilled /> Разрешённое использование земель</li>
                      <li><TbPointFilled /> Тип собственности</li>
                    </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.section} id="section-2">
                    <h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
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

                   <section itemProp="articleBody" className={styles.section} id="section-3">
                    <h2>Статистика публичной кадастровой карты</h2>
                    <p>По данным Росреестра и НСПД, на {dayjs().format("DD.MM.YYYY")} кадастровая карта {cityFrom(regionName)} района {genetiveRegionName} включает в себя:</p>
                   <ul id="statData">
                      <li><TbPointFilled />{districtStats?.stat?.kvartal?.total} кадастровых кварталов, из них с границами — {districtStats?.stat?.kvartal?.geo}</li>
                      <li><TbPointFilled />{villages?.length + otherLocality?.length + settlements?.length + territories?.length} населенных пунктов.</li>
                      <li><TbPointFilled />{districtStats?.stat?.oks?.total} объектов капитального строительства, из них с границами — {districtStats?.stat?.oks?.geo}</li>
                      <li><TbPointFilled />{districtStats?.stat?.parcel?.total} земельных участков, из них с границами — {districtStats?.stat?.parcel?.geo}</li>
                    </ul>
                  </section>

                  <section className={styles.section} itemScope itemType="https://schema.org/FAQPage" id="section-4" >
                    <h2>Часто задаваемые вопросы</h2>
                    {[
                      {
                        question: 'Можно ли получить кадастровую информацию по неразмежеванному участку?',
                        answer: `Нет, сведения по участкам ${cityFrom(regionName)} района ${genetiveRegionName} без межевания в публичной кадастровой карте отсутствуют, так как такие участки не зарегистрированы в ЕГРН.`,
                      },
                      {
                        question: `Как часто обновляются данные кадастровой карты?`,
                        answer: `Данные кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName} обновляются автоматически после каждого внесения изменений в Росреестр, в среднем данная процедура занимает 3-7 рабочих дней.`,
                      },
                      {
                        question: `Как можно проверить актуальность данных публичной кадастровой карты?`,
                        answer: `Сервис публичной кадастровой карты ${cityFrom(regionName)} района ${genetiveRegionName} содержит актуальные сведения на дату запроса информации. Однако, следует отметить, что в момент отображения сведений могут происходить внесение изменений в Росреестр. Максимально актуальные сведения будут содержаться в отчете об основных характеристиках, а также в справке о кадастровой стоимости.`,
                      },
                      {
                        question: `Почему участок не отображается на кадастровой карте?`,
                        answer: `На публичной кадастровой карте ${cityFrom(regionName)} района ${genetiveRegionName} отображаются только участки, прошедшие межевание. Если участок не отображается на карте, значит он не прошел межевание, либо данные еще не были актуализированы. Для проверки можно заказать отчет об основных характеристиках участка.`,
                      },
                      {
                        question: `Что такое межевание?`,
                        answer: `Межевание — это процедура, когда кадастровый инженер выезжает на участок, определяет координаты углов, фиксирует границы участка, подписывает акт с соседями и подготавливает документы (межевой план) для подачи в орган регистрации прав. После того, как будет проведена процедура межевания, участок будет отображаться на карте ${cityFrom(regionName)} района ${genetiveRegionName}.`,
                      },
                      {
                        question: `Почему дом или здание не отображается на карте?`,
                        answer: `Аналогично с участками, кадастровая карта ${cityFrom(regionName)} района ${genetiveRegionName} отображает только те дома, которые прошли межевание и встали на кадастровый учет в Росреестре.`,
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

                        {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
                </article>
                <section id="section-5">
                <div className={style.regionsContainer}>
                  {villages.length !==0 &&
                    <>
                      <h2>Деревни и села {cityFrom(regionName)} района</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {villages.length} деревень и сел с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)} района
                        </p>
                      </div>
                    </>
                  }
                  {villages.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {settlements.length !==0 &&
                    <>
                      <h2>ПГТ и поселки {cityFrom(regionName)} района</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {settlements.length} пгт и поселков с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)} района
                        </p>
                      </div>
                    </>
                  }
                  {settlements.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {territories.length !==0 &&
                    <>
                      <h2>СНТ, ГСК {cityFrom(regionName)} района</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {territories.length} снт и гск с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)} района
                        </p>
                      </div>
                    </>
                  }
                  {territories.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {otherLocality.length !==0 && <h2>Другие территории {cityFrom(regionName)} района</h2>}
                  {otherLocality.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
            </div>
          </div>
      </div>
      )}
      {city && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(regionName)}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                  <section itemProp="articleBody" className={styles.section} id="section-1">
                    <p>Публичная кадастровая карта {cityFrom(regionName)} {genetiveRegionName} - удобный инструмент, который позволяет в интерактивном режиме получить кадастровые сведения по любому земельному участку, зданию и сооружению, которые внесены в единый госуарственный реестр недвижимости. Следует отметить, если межевание земельного участка {cityFrom(regionName)} не произведено, то поулчить кадастровые сведения по такому участку не удастся.</p>

                    <h2>Какие сведения содержит кадастровая карта?</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} {genetiveRegionName} позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                    <ul id="listData">
                      <li><TbPointFilled /> Фактический адрес объекта недвижимости</li>
                      <li><TbPointFilled /> <Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                      <li><TbPointFilled /> <Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                      <li><TbPointFilled /> Назначение и категорию земель</li>
                      <li><TbPointFilled /> Разрешённое использование земель</li>
                      <li><TbPointFilled /> Тип собственности</li>
                    </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.section} id="section-2">
                    <h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2>
                    <p>Кадастровая карта {cityFrom(regionName)} {genetiveRegionName} позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
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

                  <section itemProp="articleBody" className={styles.section} id="section-3">
                    <h2>Статистика публичной кадастровой карты</h2>
                    <p>По данным Росреестра и НСПД, на {dayjs().format("DD.MM.YYYY")} кадастровая карта {cityFrom(regionName)} {genetiveRegionName} включает в себя:</p>
                    <ul id="statData">
                      {districtStats?.stat?.kvartal?.total && <li><TbPointFilled />{districtStats?.stat?.kvartal?.total} кадастровых кварталов, из них с границами — {districtStats?.stat?.kvartal?.geo}</li>}
                      <li><TbPointFilled />{villages?.length + otherLocality?.length + settlements?.length + territories?.length} населенных пунктов.</li>
                      <li><TbPointFilled />{streetList?.length} улиц {cityFrom(regionName)}, с нумерацией домов.</li>
                      {districtStats?.stat?.oks?.total && <li><TbPointFilled />{districtStats?.stat?.oks?.total} объектов капитального строительства, из них с границами — {districtStats?.stat?.oks?.geo}</li>}
                      {districtStats?.stat?.parcel?.total && <li><TbPointFilled />{districtStats?.stat?.parcel?.total} земельных участков, из них с границами — {districtStats?.stat?.parcel?.geo}</li>}
                    </ul>
                  </section>

                  <section className={styles.section} itemScope itemType="https://schema.org/FAQPage" id="section-4">
                    <h2>Часто задаваемые вопросы</h2>
                    {[
                      {
                        question: 'Можно ли получить кадастровую информацию по неразмежеванному участку?',
                        answer: `Нет, сведения по участкам ${cityFrom(regionName)} ${genetiveRegionName} без межевания в публичной кадастровой карте отсутствуют, так как такие участки не зарегистрированы в ЕГРН.`,
                      },
                      {
                        question: `Как часто обновляются данные кадастровой карты?`,
                        answer: `Данные кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName} обновляются автоматически после каждого внесения изменений в Росреестр, в среднем данная процедура занимает 3-7 рабочих дней.`,
                      },
                      {
                        question: `Как можно проверить актуальность данных публичной кадастровой карты?`,
                        answer: `Сервис публичной кадастровой карты ${cityFrom(regionName)} ${genetiveRegionName} содержит актуальные сведения на дату запроса информации. Однако, следует отметить, что в момент отображения сведений могут происходить внесение изменений в Росреестр. Максимально актуальные сведения будут содержаться в отчете об основных характеристиках, а также в справке о кадастровой стоимости.`,
                      },
                      {
                        question: `Почему участок не отображается на кадастровой карте?`,
                        answer: `На публичной кадастровой карте ${cityFrom(regionName)} ${genetiveRegionName} отображаются только участки, прошедшие межевание. Если участок не отображается на карте, значит он не прошел межевание, либо данные еще не были актуализированы. Для проверки можно заказать отчет об основных характеристиках участка.`,
                      },
                      {
                        question: `Что такое межевание?`,
                        answer: `Межевание — это процедура, когда кадастровый инженер выезжает на участок, определяет координаты углов, фиксирует границы участка, подписывает акт с соседями и подготавливает документы (межевой план) для подачи в орган регистрации прав. После того, как будет проведена процедура межевания, участок будет отображаться на карте ${cityFrom(regionName)} ${genetiveRegionName}.`,
                      },
                      {
                        question: `Почему дом или здание не отображается на карте?`,
                        answer: `Аналогично с участками, кадастровая карта ${cityFrom(regionName)} ${genetiveRegionName} отображает только те дома, которые прошли межевание и встали на кадастровый учет в Росреестре.`,
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

                        {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
                </article>
                <section id='section-5'>
                <div className={style.regionsContainer}>
                  {villages.length !==0 &&
                    <>
                      <h2>Деревни и села {cityFrom(regionName)}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {villages.length} деревень и сел с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)}
                        </p>
                      </div>
                    </>
                  }
                  {villages.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {settlements.length !==0 &&
                    <>
                      <h2>ПГТ и поселки {cityFrom(regionName)}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {settlements.length} пгт и поселков с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)}
                        </p>
                      </div>
                    </>
                  }
                  {settlements.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {territories.length !==0 &&
                    <>
                      <h2>СНТ, ГСК {cityFrom(regionName)}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {territories.length} снт и гск с названиями улиц и нумерацией домов на кадастровой карте {cityFrom(regionName)}
                        </p>
                      </div>
                    </>
                  }
                  {territories.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                  {otherLocality.length !==0 && <h2>Другие территории {cityFrom(regionName)}</h2>}
                  {otherLocality.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber},${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}

                  {streetList.length !==0 &&
                    <>
                      <h2>Улицы {cityFrom(regionName)}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          {streetList.length} улиц с нумерацией домов на кадастровой карте {cityFrom(regionName)}
                        </p>
                      </div>
                    </>
                  }
                  {streetList.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber}.${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
            </div>
          </div>
      </div>
      )}
      {settlement && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                  <section itemProp="articleBody" className={styles.section} id='section-1'>
                    <p>Публичная кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} {genetiveRegionName} - удобный инструмент, который позволяет в интерактивном режиме получить кадастровые сведения по любому земельному участку, зданию и сооружению, которые внесены в единый госуарственный реестр недвижимости. Следует отметить, если межевание земельного участка {cityFrom(regionName)} не произведено, то поулчить кадастровые сведения по такому участку не удастся.</p>

                    <h2>Какие сведения содержит кадастровая карта?</h2>
                    <p>Кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} {genetiveRegionName} позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                    <ul id="listData">
                      <li><TbPointFilled /> Фактический адрес объекта недвижимости</li>
                      <li><TbPointFilled /> <Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                      <li><TbPointFilled /> <Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                      <li><TbPointFilled /> Назначение и категорию земель</li>
                      <li><TbPointFilled /> Разрешённое использование земель</li>
                      <li><TbPointFilled /> Тип собственности</li>
                    </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.section} id='section-2'>
                    <h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2>
                    <p>Кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} {genetiveRegionName} позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
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

                  <section itemProp="articleBody" className={styles.section} id='section-3'>
                    <h2>Статистика публичной кадастровой карты</h2>
                    <p>По данным Росреестра и НСПД, на {dayjs().format("DD.MM.YYYY")} кадастровая карта {cityFrom(settlementName)} {cityFrom(regionName)} {genetiveRegionName} включает сведения:</p>
                    <ul id="statData">
                      <li><TbPointFilled />Улицы {cityFrom(settlementName)}, с нумерацией домов - {streetList?.length} шт</li>
                    </ul>
                  </section>

                  <section className={styles.section} itemScope itemType="https://schema.org/FAQPage" id='section-4'>
                    <h2>Часто задаваемые вопросы</h2>
                    {[
                      {
                        question: 'Можно ли получить кадастровую информацию по неразмежеванному участку?',
                        answer: `Нет, сведения по участкам ${cityFrom(settlementName)} ${cityFrom(regionName)} района  ${genetiveRegionName} без межевания в публичной кадастровой карте отсутствуют, так как такие участки не зарегистрированы в ЕГРН.`,
                      },
                      {
                        question: `Как часто обновляются данные кадастровой карты?`,
                        answer: `Данные кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} обновляются автоматически после каждого внесения изменений в Росреестр, в среднем данная процедура занимает 3-7 рабочих дней.`,
                      },
                      {
                        question: `Как можно проверить актуальность данных публичной кадастровой карты?`,
                        answer: `Сервис публичной кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} содержит актуальные сведения на дату запроса информации. Однако, следует отметить, что в момент отображения сведений могут происходить внесение изменений в Росреестр. Максимально актуальные сведения будут содержаться в отчете об основных характеристиках, а также в справке о кадастровой стоимости.`,
                      },
                      {
                        question: `Почему участок не отображается на кадастровой карте?`,
                        answer: `На публичной кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} отображаются только участки, прошедшие межевание. Если участок не отображается на карте, значит он не прошел межевание, либо данные еще не были актуализированы. Для проверки можно заказать отчет об основных характеристиках участка.`,
                      },
                      {
                        question: `Что такое межевание?`,
                        answer: `Межевание — это процедура, когда кадастровый инженер выезжает на участок, определяет координаты углов, фиксирует границы участка, подписывает акт с соседями и подготавливает документы (межевой план) для подачи в орган регистрации прав. После того, как будет проведена процедура межевания, участок будет отображаться на карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`,
                      },
                      {
                        question: `Почему дом или здание не отображается на карте?`,
                        answer: `Аналогично с участками, кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} отображает только те дома, которые прошли межевание и встали на кадастровый учет в Росреестре.`,
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

                        {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
                </article>
                <section id='section-5'>
                <div className={style.regionsContainer}>
                  {streetList.length !==0 &&
                    <>
                      <h2>Улицы {cityFrom(settlementName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          Количество улиц - {streetList.length}шт с нумерацией домов на кадастровой карте {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}.
                        </p>
                      </div>
                    </>
                  }
                  {streetList.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber}.${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
            </div>
          </div>
      </div>
      )}
      {street && (
        <div className={`${style.section} ${style.services}`}>
        <div className={style.content1}>
            <div className={style.object__block}>
                <div className={style["object__block-title"]}><h2><Link href={`/map/${regionNumber}|${baseRegionId}`} title={`Публичная кадастровая карта ${genetiveRegionName}`}>Публичная кадастровая карта</Link> {cityFrom(streetName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2></div>
                <article itemScope itemType="https://schema.org/Article" >
                  <section itemProp="articleBody" className={styles.section} id='section-1'>
                    <p>Публичная кадастровая карта {cityFrom(streetName)}{cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} - удобный инструмент, который позволяет в интерактивном режиме получить кадастровые сведения по любому земельному участку, зданию и сооружению, которые внесены в единый госуарственный реестр недвижимости. Следует отметить, если межевание земельного участка по {cityFrom(streetName)} не произведено, то поулчить кадастровые сведения по такому участку не удастся.</p>

                    <h2>Какие сведения содержит кадастровая карта?</h2>
                    <p>Кадастровая карта {cityFrom(streetName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} позволяет узнать следующие сведения по земельному участку или ОКС в режиме онлайн:</p>
                    <ul id="listData">
                      <li><TbPointFilled /> Фактический адрес объекта недвижимости</li>
                      <li><TbPointFilled /> <Link href="/kadastrovaya_stoimost" title="Кадастровая стоимость по кадастровому номеру на 2025 год бесплатно">Кадастровую стоимость</Link> земельного участка или объекта капитального строительства (ОКС)</li>
                      <li><TbPointFilled /> <Link href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</Link></li>
                      <li><TbPointFilled /> Назначение и категорию земель</li>
                      <li><TbPointFilled /> Разрешённое использование земель</li>
                      <li><TbPointFilled /> Тип собственности</li>
                    </ul>
                  </section>

                  <section itemProp="articleBody" className={styles.section} id='section-2'>
                    <h2>Какие отчёты можно заказать через публичную кадастровую карту?</h2>
                    <p>Кадастровая карта {cityFrom(streetName)} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName} позволяет заказать на каждый найденный объект недвижимости несколько различных отчетов:</p>
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

                  <section itemProp="articleBody" className={styles.section} id='section-3'>
                    <h2>Статистика публичной кадастровой карты</h2>
                    <p>По данным Росреестра и НСПД, на {dayjs().format("DD.MM.YYYY")} кадастровая карта {cityFrom(streetName)} района {cityFrom(settlementName)} {cityFrom(regionName)} {genetiveRegionName} располагает кадастровыми сведениями о:</p>
                    <ul id="statData">
                      <li><TbPointFilled />Дома на {cityFrom(streetName)} {cityFrom(settlementName)} - {houseList?.length} шт</li>
                    </ul>
                  </section>

                  <section className={styles.section} itemScope itemType="https://schema.org/FAQPage">
                    <h2>Часто задаваемые вопросы</h2>
                    {[
                      {
                        question: 'Можно ли получить кадастровую информацию по неразмежеванному участку?',
                        answer: `Нет, сведения по участкам ${cityFrom(settlementName)} ${cityFrom(regionName)} района  ${genetiveRegionName} без межевания в публичной кадастровой карте отсутствуют, так как такие участки не зарегистрированы в ЕГРН.`,
                      },
                      {
                        question: `Как часто обновляются данные кадастровой карты?`,
                        answer: `Данные кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} обновляются автоматически после каждого внесения изменений в Росреестр, в среднем данная процедура занимает 3-7 рабочих дней.`,
                      },
                      {
                        question: `Как можно проверить актуальность данных публичной кадастровой карты?`,
                        answer: `Сервис публичной кадастровой карты ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} содержит актуальные сведения на дату запроса информации. Однако, следует отметить, что в момент отображения сведений могут происходить внесение изменений в Росреестр. Максимально актуальные сведения будут содержаться в отчете об основных характеристиках, а также в справке о кадастровой стоимости.`,
                      },
                      {
                        question: `Почему участок не отображается на кадастровой карте?`,
                        answer: `На публичной кадастровой карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} отображаются только участки, прошедшие межевание. Если участок не отображается на карте, значит он не прошел межевание, либо данные еще не были актуализированы. Для проверки можно заказать отчет об основных характеристиках участка.`,
                      },
                      {
                        question: `Что такое межевание?`,
                        answer: `Межевание — это процедура, когда кадастровый инженер выезжает на участок, определяет координаты углов, фиксирует границы участка, подписывает акт с соседями и подготавливает документы (межевой план) для подачи в орган регистрации прав. После того, как будет проведена процедура межевания, участок будет отображаться на карте ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName}.`,
                      },
                      {
                        question: `Почему дом или здание не отображается на карте?`,
                        answer: `Аналогично с участками, кадастровая карта ${cityFrom(settlementName)} ${cityFrom(regionName)} района ${genetiveRegionName} отображает только те дома, которые прошли межевание и встали на кадастровый учет в Росреестре.`,
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

                        {/* <-- Тут единственное изменение: управление display через inline-style --> */}
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
                </article>
                <section id='section-5'>
                <div className={style.regionsContainer}>
                  {houseList.length !==0 &&
                    <>
                      <h2>Список домов  - {houseList[0].streetName} {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}</h2>
                      <div className={style.houseDescription}>
                        <p>
                          Нумерация домов - {houseList[0].streetName} на кадастровой карте {cityFrom(settlementName)} {cityFrom(regionName)} района {genetiveRegionName}.
                        </p>
                      </div>
                    </>
                  }
                  {houseList.map((it, index) => {
                    return (
                      <>
                        <Link href={`/map/${regionNumber}^${it.id}`} className={style.regionName} key={index}>
                          <div className={style.statRegionContainer}>
                            <div className={style.name}>{it.name}</div>
                          </div>
                        </Link>
                      </>
                    )
                  })}
                </div>
                </section>
            </div>
          </div>
      </div>
      )}
    </>
  }
      {/* <Scroll /> */}
      <Footer />
    </>
  )
}


export async function getServerSideProps(context) {
  const db = await getDatabase();
  let regionData = context.params.map;

  if (regionData.includes('-')) {
    const regionNumber = regionData.split('-')[0];
    // const regionId = parseInt(regionData.split('-')[1]);
    const regionId = regionData.split('-')[1];
    console.log('regionNumber', regionNumber);
    const parentRegionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
    const englishRegionName = regionsRus.find((it) => it.rus === parentRegionName)?.EN;


    const collection = db.collection(`${englishRegionName}_fias_street`);
    const count = await db.collection(`${englishRegionName}_fias_street`).countDocuments();
    console.log(`✅ Коллекция "${englishRegionName}_fias_street" найдена, документов: ${count}`);
    const array = await collection.find({'parent_id_adm': regionId }).toArray();
    const regionNameObject = await collection.findOne({'id': regionId });
    const regionName = regionNameObject?.name;

    const settlementsArray = array.map((it) => {
      return {
        name: `${it.type}. ${it.name}`,
        id: it.id,
        parentId: it.parent_id_adm,
        parentNum: it.parent_id_mun,
        okato: it.okato,
        oktmo: it.oktmo,
        kladr: it.kladr,
        postal_code: it.postal_code
      };

    });

    const sortedSettlementsArray = settlementsArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });


    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({
      districtName: regionName,
      'data.feature.attrs.okrug': regionNumber
    });


    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    const center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);

    return {
      props: {
        list: JSON.stringify(sortedSettlementsArray) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        region: 'ok',
      }
    };
  }

  if (regionData.includes('_')) {
    const regionNumber = regionData.split('_')[0];
    // const regionId = parseInt(regionData.split('_')[1]);
    const regionId = regionData.split('_')[1];
    // const collection = db.collection('Reestr_geo');
    const parentRegionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
    const englishRegionName = regionsRus.find((it) => it.rus === parentRegionName)?.EN;


    const collection = db.collection(`${englishRegionName}_fias_street`);
    const array = await collection.find({
      parent_id_adm: regionId,
      level: { $in: [6, 7] }
    }).toArray();

    const regionNameObject = await collection.findOne({'id': regionId });
    let regionName = regionNameObject?.name;

    const settlementsArray = array.map((it) => {
      return {
        name: `${it.type}. ${it.name}`,
        id: it.id,
        parentId: it.parent_id_adm,
        parentNum: it.parent_id_mun,
        okato: it.okato,
        oktmo: it.oktmo,
        kladr: it.kladr,
        postal_code: it.postal_code
      };

    });



    const clearRegionList = Array.from(new Set(settlementsArray.map(JSON.stringify)), JSON.parse);
    const sortedRegionArray = clearRegionList.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });


    const dataArray = await collection.find({
      parent_id_adm: regionId,
      level: { $in: [8] }
    }).toArray();

    // const array = await collection.find({ 'regionId': regionId }).toArray();
    const streetArray = dataArray.map((it) => {
      return {
        name: `${it.type}. ${it.name}`,
        id: it.id,
        parentId: it.parent_id_adm,
        parentNum: it.parent_id_mun,
        okato: it.okato,
        oktmo: it.oktmo,
        kladr: it.kladr,
        postal_code: it.postal_code
      };

    });

    const clearStreetListArray = Array.from(new Set(streetArray.map(JSON.stringify)), JSON.parse);

    const sortedStreetArray = clearStreetListArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    const list = sortedRegionArray.filter(item => !item.name.includes('р-н')).filter(item => item.name.trim() !== '');
    // let regionName = list[0]?.region_name;
    if (regionId === 39100000600000) {
      regionName = "Джанкой"
    }
    const db1 = client.db('cadastr');
    const collection1 = db1.collection('reeestr_districts');
    const object = await collection1.findOne({
      districtName: regionName,
      'data.feature.attrs.okrug': regionNumber
    });
    // let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y]);

    function convertCoordinates(point) {
      return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
    }

    let center = convertCoordinates([object?.data?.feature?.center?.x, object?.data?.feature?.center?.y])

    if (!object) {
      const askToken = await axios('https://doc.gockadastr.site/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: regionName, 'count': 10 }
      });

      const settlementDadada = getAskDadata.data.suggestions[0];
      center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
    }

    return {
      props: {
        list: JSON.stringify(list) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        districtData: JSON.stringify(object?.data?.feature) || null,
        center: JSON.stringify(center) || null,
        streetArray: JSON.stringify(sortedStreetArray) || null,
        city: 'ok'
      }
    };
  }

  if (regionData.includes(',')) {
    const regionNumber = regionData.split(',')[0];
    // const regionId = parseInt(regionData.split(',')[1]);
    const regionId = regionData.split(',')[1];
    const macroRegionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
    const englishRegionName = regionsRus.find((it) => it.rus === macroRegionName)?.EN;


    const collection = db.collection(`${englishRegionName}_fias_street`);
    const settlementNameObject = await collection.findOne({'id': regionId });

    let settlementName = settlementNameObject?.name;
    const settlementType = settlementNameObject?.type;
    let regionNameId = settlementNameObject?.parent_id_adm;
    const regionNameObject = await collection.findOne({'id': regionNameId });

    const regionName = regionNameObject?.name;
    const regionType = regionNameObject?.type;


    const dataArray = await collection.find({
      parent_id_adm: regionId,
      level: { $in: [8] }
    }).toArray();

    const streetArray = dataArray.map((it) => {
      return {
        name: `${it.type}. ${it.name}`,
        id: it.id,
        parentId: it.parent_id_adm,
        parentNum: it.parent_id_mun,
        okato: it.okato,
        oktmo: it.oktmo,
        kladr: it.kladr,
        postal_code: it.postal_code
      };

    });

    const clearStreetListArray = Array.from(new Set(streetArray.map(JSON.stringify)), JSON.parse);

    const sortedStreetArray = clearStreetListArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    let fullAddress = `${macroRegionName}, ${regionName} ${regionType}, ${settlementName}`;

    const askToken = await axios('https://doc.gockadastr.site/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: fullAddress, 'count': 10 }
    });

    let settlementDadada = getAskDadata.data.suggestions[0];


    if (!settlementDadada) {
      const fullAddress = `${macroRegionName}, ${regionName}, ${settlementName}`
      const askToken = await axios('https://doc.gockadastr.site/api/token');
      const token = askToken.data;
      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
      const getAskDadata = await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
          'Host': 'suggestions.dadata.ru',
        },
        url: encodeURI(url),
        data: { query: fullAddress, 'count': 10 }
      });
      settlementDadada = getAskDadata.data.suggestions[0]
    }


    let center = [settlementDadada?.data?.geo_lat || 55.755864, settlementDadada?.data?.geo_lon || 37.617698, 13];


    return {
      props: {
        streetArray: JSON.stringify(sortedStreetArray) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        settlement: 'ok',
        // macroRegionNameGenetive: macroRegionNameGenetive || null,
        settlementName: `${settlementType}. ${settlementName}` || null,
        center: JSON.stringify(center) || null,
      }
    };
  }

   if (regionData.includes('.')) {
    const regionNumber = regionData.split('.')[0];
    // const regionId = parseInt(regionData.split('.')[1]);
    const regionId = regionData.split('.')[1];
    const macroRegionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
    const englishRegionName = regionsRus.find((it) => it.rus === macroRegionName)?.EN;

    const collection = db.collection(`${englishRegionName}_fias_street`);
    const streetNameObject = await collection.findOne({'id': regionId });

    let streetName = streetNameObject?.name;
    const streetType = streetNameObject?.type;
    let settlementNameId = streetNameObject?.parent_id_adm;
    const settlementNameObject = await collection.findOne({'id': settlementNameId });

    const settlementName = settlementNameObject?.name;
    const settlementType = settlementNameObject?.type;
    const regionNameId = settlementNameObject?.parent_id_adm;
    const regionNameObject = await collection.findOne({'id': regionNameId });
    const regionName = regionNameObject?.name;
    const regionType = regionNameObject?.type;

    const dataArray = await collection.find({
      parent_id_adm: regionId,
      level: { $in: [9] }
    }).toArray();

    const houseArray = dataArray.map((it) => {
      return {
        name: `${streetType} ${streetName}. ${it.name}`,
        id: it.id,
        parentId: it.parent_id_adm,
        parentNum: it.parent_id_mun,
        okato: it.okato,
        oktmo: it.oktmo,
        kladr: it.kladr,
        postal_code: it.postal_code,
        streetName: streetName
      };

    });

    const clearHouseArray = Array.from(new Set(houseArray.map(JSON.stringify)), JSON.parse);

    const sortedHouseArray = clearHouseArray.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    let fullAddress = `${macroRegionName}, ${regionName} ${regionType}, ${settlementType} ${settlementName} , ${streetType} ${streetName}`;

    const getAskDadata = await axios(`https://cadmap.su/api/nspdCadNumData?cadNumber=${encodeURI(fullAddress)}`)
    const filtered = getAskDadata?.data?.data?.features?.filter(f => f?.geometry?.type === 'Point');


    const streetData = filtered?.[Math.floor((filtered.length - 1) / 2)]
    // let streetData = getAskDadata.data.suggestions[0];
    const coordinates = streetData?.geometry?.coordinates;

    function mercatorToLonLat([x, y]) {
      const lon = (x / 6378137) * (180 / Math.PI);
      const lat = (2 * Math.atan(Math.exp(y / 6378137)) - Math.PI / 2) * (180 / Math.PI);
      return [lat, lon];
    }

    const [lat, lon] = mercatorToLonLat(coordinates);

    let center = [lat || 55.755864, lon || 37.617698, 18];
    // console.log('streetData', streetData);

    return {
      props: {
        houseArray: JSON.stringify(sortedHouseArray) || null,
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        street: 'ok',
        // macroRegionNameGenetive: macroRegionNameGenetive || null,
        settlementName: `${settlementType}. ${settlementName}` || null,
        streetName: `${streetType}. ${streetName}` || null,
        center: JSON.stringify(center) || null,
      }
    };
  }

  if (regionData.includes('^')) {
    const regionNumber = regionData.split('^')[0];
    // const regionId = parseInt(regionData.split('^')[1]);
    const regionId = regionData.split('^')[1];
    const macroRegionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
    const englishRegionName = regionsRus.find((it) => it.rus === macroRegionName)?.EN;

    const collection = db.collection(`${englishRegionName}_fias_street`);
    const houseNameObject = await collection.findOne({'id': regionId });
    const houseGuid = houseNameObject?.guid;
    const streetId = houseNameObject?.parent_id_adm;
    const streetNameObject = await collection.findOne({'id': streetId });

    let streetName = streetNameObject?.name;
    const streetType = streetNameObject?.type;
    let settlementNameId = streetNameObject?.parent_id_adm;
    const settlementNameObject = await collection.findOne({'id': settlementNameId });

    const settlementName = settlementNameObject?.name;
    const settlementType = settlementNameObject?.type;
    const regionNameId = settlementNameObject?.parent_id_adm;
    const regionNameObject = await collection.findOne({'id': regionNameId });
    const regionName = regionNameObject?.name;

    const askFias = await axios({
      method: 'GET',
      headers: {
        'master-token': 'bfa2407b-1dc4-4714-9346-b678408eb099',
        'Host': 'fias-public-service.nalog.ru',
      },
      url: encodeURI(`https://fias-public-service.nalog.ru/api/spas/v2.0/GetAddressItemByGuid?object_guid=${houseGuid}&address_type=2`),
    })

    const cadastrNumber = askFias?.data?.addresses?.[0]?.address_details?.cadastral_number


    if (!cadastrNumber) {
      return {
        props: {
          regionName: regionName || null,
          regionNumber: regionNumber || null,
          house: 'ok',
          settlementName: `${settlementType}. ${settlementName}` || null,
          streetName: `${streetType}. ${streetName}` || null,
          center: JSON.stringify([55.755864, 37.617698, 13]) || null,

        }
      };
    }


    return {
      props: {
        regionName: regionName || null,
        regionNumber: regionNumber || null,
        house: 'ok',
        settlementName: `${settlementType}. ${settlementName}` || null,
        streetName: `${streetType}. ${streetName}` || null,
        cadNumber: cadastrNumber
      }
    };
  }

  const regionNumber = context.params.map;
  const regionName = macroRegions.find((it) => it.key === parseInt(regionNumber))?.name;
  const englishRegionName = regionsRus.find((it) => it.rus === regionName)?.EN;

  const collection = db.collection('reeestr_regions');
  const regionStatsData = await collection.findOne({ 'attrs.id': regionNumber });
  let center = convertCoordinates([regionStatsData?.center?.x, regionStatsData?.center?.y]);

  if (!regionStatsData) {
    const askToken = await axios('https://doc.gockadastr.site/api/token');
    const token = askToken.data;
    const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: { query: regionName, 'count': 10 }
    });

    const settlementDadada = getAskDadata.data.suggestions[0];
    center = [settlementDadada?.data?.geo_lat, settlementDadada?.data?.geo_lon];
  }

  const collection1 = db.collection(`${englishRegionName}_fias_street`);
  const array = await collection1.find({ 'level': { $in: [2, 3, 5] } }).toArray();
  const regionArray = array.map((it) => {
    return {
      name: `${it.type} ${it.name}`,
      id: it.id,
      parentId: it.parent_id_adm,
      parentNum: it.parent_id_mun
    };
  });


  const clearRegionList = Array.from(new Set(regionArray.map(JSON.stringify)), JSON.parse);
  const sortedRegionArray = clearRegionList.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  const cities = sortedRegionArray.filter(item => !item.name.includes('р-н')).filter(item => !item.name.includes('г.о.')).filter(item => !item.name.includes('с/с')).filter(item => item.name.trim() !== '');


  const districts = sortedRegionArray.filter(item => item.name.includes('р-н')).filter(item => !item.name.includes('м.р-н')).filter(item => item.name.trim() !== '');

  function convertCoordinates(point) {
    return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
  }


  return {
    props: {
      cities: JSON.stringify(cities) || null,
      districts: JSON.stringify(districts) || null,
      regionName: regionName || null,
      regionStat: JSON.stringify(regionStatsData?.stat) || null,
      center: JSON.stringify(center) || null,
      regionNumber: regionNumber || null,

    }
  };
}
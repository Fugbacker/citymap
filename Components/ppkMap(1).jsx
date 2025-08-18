import { useEffect, useState, useRef } from 'react'
import { YMaps, Map, TypeSelector, ZoomControl, Placemark, FullscreenControl, ListBox, ListBoxItem, Polygon } from '@pbe/react-yandex-maps'
import { CSSTransition } from 'react-transition-group';
import { cityIn, cityFrom, cityTo } from 'lvovich';
import { mapTypes } from './files/constants/map-types.constant';
import ChartCadCostHistory from './chartCadCostHistory';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PuffLoader from "react-spinners/PuffLoader";
import { Link } from 'react-scroll';
import style from '../styles/File.module.css';
import YMapsDeck from './ymapsDeck';
import YMapsLayers from './ymapsLayers';
import { getLayers } from './files/constants/build-type-layer.constant';
import CheckRaports from './checkRaports';
import CloseIcon from '@material-ui/icons/Close';
import { set } from 'mobx';
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import PromoCode from './promoCode';


const PpkMap = ({ cadastrNumber, setCloseChecker, setAlarmMessage, setCadastrNumber, flatRights, setPromoCode, promoCode, setActivate, activate, lat, lon, rightsCheck, owner, sendActivePromoCode, closeChecker, setLoading, loading, setBaloonData, baloonData, genetiveRegionName, regionName, districtsList, city, settlement, settlementName, onCkickCadastrNumber, setOnCkickCadastrNumber, setIsVisible, isVisible, error, setError, type, setType }) => {
  const router = useRouter();
  const path = router?.asPath
  const [bbox, setBbox] = useState(null);
  const [historyCadCost, setHistoryCadCost] = useState([]);
  const [imageLayer, setImageLayer] = useState(null);
  const [state, setState] = useState([lat || 55.755864, lon ||37.617698, 13]);
  const [open, setOpen] = useState(false);

  // const [baloonData, setBaloonData] = useState('');
  // const [loading, setLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const ymaps = useRef(null);
  const placemarkRef = useRef(null);
  const mapRef = useRef(null);
  const listBoxRef = useRef(null);
  const ref = useRef(null);
  const loadingBarRef = useRef(null);
  const nodeRef = useRef(null);

  const status = baloonData?.properties?.options?.previously_posted || baloonData?.result?.object?.status || baloonData?.features?.[0]?.properties?.options?.common_data_status || baloonData?.features?.[0]?.properties?.options?.previously_posted || baloonData?.features?.[1]?.properties?.options?.common_data_status || baloonData?.features?.[1]?.properties?.options?.previously_posted
  const permittedUse = baloonData?.features?.[0]?.properties?.options?.permitted_use_established_by_document
  const address = baloonData?.attrs?.address || baloonData?.features?.[0]?.properties?.options?.readable_address

  const area_value = baloonData?.parcelData?.areaValue || baloonData?.objectData?.flat?.area || baloonData?.objectData?.building?.area || baloonData?.properties?.options?.land_record_area || baloonData?.result?.object?.area || baloonData?.elements?.[0]?.area || baloonData?.features?.[0]?.properties?.options?.area || baloonData?.features?.[0]?.properties?.options?.specified_area || baloonData?.features?.[1]?.properties?.options?.area || baloonData?.features?.[1]?.properties?.options?.specified_area || baloonData?.features?.[0]?.properties?.options?.area || baloonData?.features?.[0]?.properties?.options?.declared_area || baloonData?.features?.[0]?.properties?.options?.area || baloonData?.features?.[0]?.properties?.options?.specified_area || baloonData?.features?.[0]?.properties?.options?.build_record_area || baloonData?.features?.[1]?.properties?.options?.build_record_area

  const oksElementsConstructStr = baloonData?.features?.[0]?.properties?.options?.materials

  const cad_cost = baloonData?.attrs?.cad_cost || baloonData?.features?.[0]?.properties?.options?.cost_value
  const cn = baloonData?.attrs?.cn || baloonData?.features?.[0]?.properties?.options?.cad_num
  const kvartal = baloonData?.attrs?.kvartal
  const util_by_doc = baloonData?.attrs?.util_by_doc || baloonData?.features?.[0]?.properties?.options?.land_record_category_type
  const parcel_type = baloonData?.attrs?.parcel_type
  const surveying = baloonData?.surveying
  const cost_registration_date = baloonData?.features?.[0]?.properties?.options?.cost_registration_date

  const typeElement = baloonData?.features?.[0]?.properties?.options?.build_record_type_value || baloonData?.features?.[1]?.properties?.options?.build_record_type_value || baloonData?.features?.[0]?.properties?.options?.land_record_type || baloonData?.features?.[1]?.properties?.options?.land_record_type || 'Объект'

  const rigthType = baloonData?.features?.[0]?.properties?.options?.ownership_type || baloonData?.features?.[1]?.properties?.options?.ownership_type || baloonData?.features?.[0]?.properties?.options?.ownership_type || baloonData?.features?.[0]?.properties?.options?.right_type

  const buildName = baloonData?.objectData?.building?.name || baloonData?.features?.[0]?.properties?.options?.params_type || baloonData?.features?.[0]?.properties?.options?.building_name || baloonData?.features?.[1]?.properties?.options?.building_name

  const oksFloors = baloonData?.parcelData?.oksFloors || baloonData?.objectData?.building?.floors || baloonData?.elements?.[0]?.floor || baloonData?.features?.[0]?.properties?.options?.floors || baloonData?.features?.[1]?.properties?.options?.floors || baloonData?.features?.[0]?.properties?.options?.floors

  const oksYearBuilt = baloonData?.parcelData?.oksYearBuilt || baloonData?.elements?.[0]?.oksYearBuild || baloonData?.features?.[0]?.properties?.options?.year_built || baloonData?.features?.[1]?.properties?.options?.year_built || baloonData?.features?.[0]?.properties?.options?.year_built

  const dateCreate = baloonData?.parcelData?.dateCreate || baloonData?.objectData?.flat?.dateCreate || baloonData?.objectData?.cadRecordDate || baloonData?.result?.object?.createdAt || baloonData?.elements?.[0]?.regDate && new Date(baloonData?.elements?.[0]?.regDate).toISOString().split('T')[0] || baloonData?.features?.[0]?.properties?.options?.registration_date && new Date(baloonData?.features?.[0]?.properties?.options?.registration_date).toISOString().split('T')[0] || baloonData?.features?.[0]?.properties?.options?.land_record_reg_date && new Date(baloonData?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[0] || baloonData?.features?.[1]?.properties?.options?.registration_date && new Date(baloonData?.features?.[1]?.properties?.options?.registration_date).toISOString().split('T')[0] || baloonData?.features?.[1]?.properties?.options?.land_record_reg_date && new Date(baloonData?.features?.[0]?.properties?.options?.land_record_reg_date).toISOString().split('T')[1] || baloonData?.features?.[0]?.properties?.options?.land_record_reg_date

  const costIndex = baloonData?.features?.[0]?.properties?.options?.cost_index

  const askPpk = async () => {
    setOpen(false)
    setLoading(true)
    setCloseChecker(false)
    setError(false)
    loadingBarRef.current.continuousStart(); // Запуск прогресс-бара

    try {

      let needType
      if (type === 'OKS') {
        needType = '36049'
      }
      if (type === 'PARCEL') {
        needType = '36048'
      }

      // const nspdData = await axios(`/api/nspdCadNumData?cadNumber=${cadastrNumber}`)
      const nspdData = await axios.get(`/api/nspdCadNumData?cadNumber=${cadastrNumber}`, {
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          loadingBarRef.current.progress = percent; // Устанавливаем процент загрузки
        },
      });



      const objectData = nspdData?.data?.data || nspdData?.data


      if (objectData.features?.length !== 0 && objectData.length !== 0) {
        const coordinate = objectData?.features?.[0]?.geometry?.coordinates
        const check = objectData?.features?.[0]?.geometry?.type === "Polygon"
        const convertedCoordinate = convertCoords(coordinate)

        const getPolygonCenter = (coords) => {
          let latSum = 0;
          let lngSum = 0;

          coords.forEach(coord => {
            latSum += coord[0];
            lngSum += coord[1];
          });

          const centerLat = latSum / coords.length;
          const centerLng = lngSum / coords.length;

          return [centerLat, centerLng];
        };

        const outerCoordinates = convertedCoordinate?.[0];
        let  centerCoordinates
        check ? centerCoordinates = getPolygonCenter(outerCoordinates) : centerCoordinates = convertCoords([coordinate]).flat();


        if (placemarkRef.current) {
          placemarkRef.current.geometry.setCoordinates([centerCoordinates?.[0], centerCoordinates?.[1]]);
        } else {
          placemarkRef.current = createPlacemark([centerCoordinates?.[0], centerCoordinates?.[1]]);
          mapRef.current.geoObjects.add(placemarkRef.current);
        }

        setState([centerCoordinates?.[0], centerCoordinates?.[1], 18])
        setBaloonData(objectData)
        setOpen(true)
        setCloseChecker(true)
        setLoading(false)
        check ? setBbox(convertedCoordinate) : setBbox(convertCoords([coordinate]).flat())


      } else {
        // закрыл старый поиск по pkk
        // const pkkData = await axios(`/api/geodecoder?cadNumber=${cadastrNumber}`)
        //   try {
        //     if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
        //       setBaloonData(pkkData?.data?.pkk)
        //       setCloseChecker(true)
        //       setLoading(false)
        //       setOpen(true)
        //       setOnCkickCadastrNumber(cadastrNumber)
        //       // setBbox(coordinates)
        //     return
        //     } else {
        //       setOnCkickCadastrNumber('')
        //       setCadastrNumber('')
        //       setCloseChecker(false)
        //       // setError(true)
        //       setBaloonData('error')
        //       setLoading(false)
        //       setOpen(true)
        //     }
        //   } catch {
        //     setOnCkickCadastrNumber('')
        //     setCadastrNumber('')
        //     setCloseChecker(false)
        //     setBaloonData('error')
        //     setLoading(false)
        //     setOpen(true)
        //   }
        setOnCkickCadastrNumber('')
        setCadastrNumber('')
        setCloseChecker(false)
        setBaloonData('error')
        setLoading(false)
        setOpen(true)
      }
    } catch {
      // закрыл старый поиск по pkk
      // const pkkData = await axios(`/api/geodecoder?cadNumber=${cadastrNumber}`)
      // try {
      //   if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
      //     setBaloonData(pkkData?.data?.pkk)
      //     setCloseChecker(true)
      //     setLoading(false)
      //     setOpen(true)
      //     setOnCkickCadastrNumber(cadastrNumber)

      //   return
      //   } else {
      //     setOnCkickCadastrNumber('')
      //     setCadastrNumber('')
      //     setCloseChecker(false)
      //     // setError(true)
      //     setBaloonData('error')
      //     setOpen(true)
      //     setLoading(false)
      //   }
      // } catch {
      //   setOnCkickCadastrNumber('')
      //   setCadastrNumber('')
      //   setCloseChecker(false)
      //   setError(true)
      //   setBaloonData('error')
      //   setOpen(true)
      //   setLoading(false)
      // }

      setOnCkickCadastrNumber('')
      setCadastrNumber('')
      setCloseChecker(false)
      setError(true)
      setBaloonData('error')
      setOpen(true)
      setLoading(false)
    }
    finally {
      loadingBarRef.current.complete(); // Завершаем прогресс-бар
    }
  }

  function convertCoordinates(point) {
    return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
  }

  const buildBbox = (extent) => {
    let dx = extent?.xmax - extent?.xmin;
    let dy = extent?.ymax - extent?.ymin;
    const bbox = `${extent?.xmin},${extent?.ymin},${extent?.xmax},${extent?.ymax}`;
    // const bbox = [[[extent?.xmin, extent?.ymin], [extent?.xmax, extent?.ymax]]];

    switch (true) {
      case dx < dy:
        return { point: [(dy - dx) / 2, 0], bbox };
      case dx > dy:
        return { point: [0, (dx - dy) / 2], bbox };
      default:
        return { point: [0, 0], bbox };
    }
  }

  const buildBounds = (extent) => {
    const { point, bbox } = buildBbox(extent);
    const min = convertCoordinates([extent?.xmin - point[0], extent?.ymin - point[1]]);
    const max = convertCoordinates([extent?.xmax + point[0], extent?.ymax + point[1]]);
    return {
      bounds: [min[1], min[0], max[1], max[0]],
      bbox
    }
  }

  const buildUrlImage = async (data) => {
    const { bbox, attrs, type } = data;
    const response = await axios(`/api/exportMap?bbox=${bbox}&type=${type}&id=${encodeURIComponent(attrs.id)}`)
    return response?.data?.url
  }

  const addImageLayers = (data) => {
    const { bounds, image } = data;
    setImageLayer([{ name: 'imageLayer', type: 'bitmap', visible: true, bounds, image, zIndex: 101 }]);
  }

  const createImageLayer = async (data) => {
    const { extent } = data?.features?.[0] || data?.pkk;
    const { bbox, bounds } = buildBounds(extent);
    const image = await buildUrlImage({ ...data?.features?.[0] || data?.pkk, bbox });
    addImageLayers({ bounds, image });
  }

  const history = async (cadNum) => {
     const history =await axios(`/api/cadCostHistory?cadNumber=${cadastrNumber || cadNum}`)
     setHistoryCadCost(history?.data)

  }


  useEffect(() => {
    if (cadastrNumber) {
      askPpk()
    }
  }, [cadastrNumber])


  useEffect(() => {
    if (isMapReady) {
      mapRef.current.setCenter([state[0], state[1]], state[2])
    }
  }, [state]);

  useEffect(() => {
    if (cadastrNumber) {
      history()
    }
  }, [cadastrNumber, onCkickCadastrNumber])


  const paramInfo = {
    'Тип объекта': typeElement,
    'Тип собственности:':  rigthType,
    'Название:': buildName,
    'Категория земель': util_by_doc,
    'Разрешенное использование': permittedUse,
    'Статус:': status,
    'Материалы стен': oksElementsConstructStr,
    'Этажность:': oksFloors,
    'Год постройки:': oksYearBuilt,
    'Дата постановки на учёт:': dateCreate,
    'Кадастровый номер:': <NextLink href={`/kadastr/${cn}`}><b>{cn}</b></NextLink>,
    'Кадастровый квартал': kvartal,
    'Адрес': address,
    'Декларируемая площадь': area_value && `${area_value} кв.м.`,
    'Кадастровая стоимость': `${cad_cost} рублей`,
    'Кадастровая стоимость 1 кв. м.': costIndex && (`${costIndex} руб.`),
    'Кадастровый план':  <Link to="egrn" smooth="true" activeClass="active" spy={true} duration={500}><b>Получить</b></Link>,
    'Ограничения': <div className={style.closedData}><p>в отчете</p></div>,
    'Обременения': <div className={style.closedData}><p>в отчете</p></div>
  }

  const paramInfo1 = {
    '1': 'Межевание не делалось вообще',
    '2': 'Межевание сделано давно (до 2006 года)',
    '3': 'Межевание сделано недавно (1-2 месяца назад)',
    '4': <b>Технические ошибки кадастровой карты (требуется повторный поиск)</b>,
  }

  const outputObject = () => {
    return Object.keys(paramInfo).map((it) => {
      return paramInfo[it] && (
        <tr><td>{it}</td><td><span>{paramInfo[it]}</span></td></tr>
      )
    })
  }

  const outputObject1 = () => {
    return Object.keys(paramInfo1).map((it) => {
      return paramInfo1[it] && (
        <tr><td><span>{paramInfo1[it]}</span></td></tr>
      )
    })
  }

  const createPlacemark = (coords) => {
    try {
          return new ymaps.current.Placemark(
      coords,
      {
        preset: "islands#violetDotIconWithCaption",
        draggable: true
      }
    );
    }
    catch (error) {
      return new ymaps.current.Placemark(
        state,
        {
          preset: "islands#violetDotIconWithCaption",
          draggable: true
        }
      );
    }
  };



  const onMapClick = async (event) => {
    loadingBarRef.current.continuousStart(); // Запуск прогресс-бара
    setOpen(false)
    setBbox(null)
    setLoading(true)
    setCadastrNumber('')
    setOnCkickCadastrNumber('')
    setCloseChecker(false)
    setError(false)
    setBaloonData('')

    const coords = event.get("coords");
    if (placemarkRef.current) {
      placemarkRef.current.geometry.setCoordinates(coords);
    } else {
      placemarkRef.current = createPlacemark(coords);
      mapRef.current.geoObjects.add(placemarkRef.current);
    }


    const zoom = mapRef.current.getZoom(); // Получаем уровень зума
    const size = { width: 50, height: 50 }; // Размер карты в пикселях
    const bbox = createBbox(coords, zoom, size);
    const typeName = mapRef.current.getType();

    let type

    if (typeName.includes('nspd-buildings')) {
      type = '36049'
    }
    if (typeName.includes('nspd-areas')) {
      type = '36048'
    }

      try {
        // const nspdResponse = await axios(`/api/nspdData?bbox=${bbox}`);
        const nspdResponse = await axios.get(`/api/nspdData?bbox=${bbox}&type=${type}`, {
          onDownloadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            loadingBarRef.current.progress = percent; // Устанавливаем процент загрузки
          },
        });

        const nspdData = nspdResponse?.data;

        const cadastrNumber = nspdData?.features?.[0]?.properties?.options?.cad_num || nspdData?.features?.[0]?.properties?.externalKey
        history(cadastrNumber)
        const coordinate = nspdData?.features?.[0]?.geometry?.coordinates
        const convertedCoordinate = convertCoords(coordinate) // Конвертация координат широты/долготы в
        setBbox(convertedCoordinate)
        setBaloonData(nspdData)
        setCloseChecker(true)
        setLoading(false)
        setOpen(true)
        setOnCkickCadastrNumber(cadastrNumber)

        // закрыл старый запрос к pkk карте

        // if (nspdData?.features?.length === 0) {
        //   const pkkData = await axios(`/api/pkkCoords?latitude=${coords[1]}&longitude=${coords[0]}`)
        //   const cadNumber = pkkData?.data?.features?.[0]?.attrs?.cn || null;
        //   history(cadNumber)
        //   const extent = pkkData?.data?.features?.[0]?.extent || pkkData?.data?.pkk?.extent || pkkData?.data
        //   pkkData?.data?.features?.[0] && createImageLayer(pkkData?.data);
        //   try {
        //     // Если не удалось получить данные от nspd, делаем запрос к pkkData
        //     const pkkData = await axios(`/api/geodecoder?cadNumber=${cadNumber}`)
        //     if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
        //       setBaloonData(pkkData?.data?.pkk)
        //       setCloseChecker(true)
        //       setLoading(false)
        //       setOnCkickCadastrNumber(cadNumber)
        //       setOpen(true)
        //       // setBbox(coordinates)
        //     return
        //     } else {
        //       setCloseChecker(false)
        //       // setError(true)
        //       setBaloonData('error')
        //       setLoading(false)
        //       setOpen(true)
        //     }

        //   } catch (error) {
        //     console.error('Error fetching pkkData:', error);
        //     setCloseChecker(false)
        //     // setError(true)
        //     setBaloonData('error')
        //     setLoading(false)
        //     setOpen(true)
        //   }

        // } else {
        //   const cadastrNumber = nspdData?.features?.[0]?.properties?.options?.cad_num || nspdData?.features?.[0]?.properties?.externalKey
        //   history(cadastrNumber)
        //   const coordinate = nspdData?.features?.[0]?.geometry?.coordinates
        //   const convertedCoordinate = convertCoords(coordinate) // Конвертация координат широты/долготы в
        //   setBbox(convertedCoordinate)
        //   setBaloonData(nspdData)
        //   setCloseChecker(true)
        //   setLoading(false)
        //   setOpen(true)
        //   setOnCkickCadastrNumber(cadastrNumber)
        //   mapRef.current.panTo(coords, {
        //     flying: true, // Параметр активирует плавный переход
        //     delay:500,
        //     timingFunction: "ease"
        //   });
        // }
      } catch (error) {
          // закрыл старый запрос к pkk карте

          // const pkkData = await axios(`/api/pkkCoords?latitude=${coords[1]}&longitude=${coords[0]}`)
          // const cadNumber = pkkData?.data?.features?.[0]?.attrs?.cn || null;
          // const extent = pkkData?.data?.features?.[0]?.extent || pkkData?.data?.pkk?.extent || pkkData?.data
          // pkkData?.data?.features?.[0] && createImageLayer(pkkData?.data);
          // try {
          //   // Если не удалось получить данные от nspd, делаем запрос к pkkData
          //   const pkkData = await axios(`/api/geodecoder?cadNumber=${cadNumber}`)

          //   if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
          //     setBaloonData(pkkData?.data?.pkk)
          //     setCloseChecker(true)
          //     setLoading(false)
          //     setOpen(true)
          //     setOnCkickCadastrNumber(cadNumber)
          //     // setBbox(coordinates)
          //   return
          //   } else {
          //     setCloseChecker(false)
          //     // setError(true)
          //     setOpen(true)
          //     setBaloonData('error')
          //     setLoading(false)
          //   }

          // } catch (error) {
          //   console.error('Error fetching pkkData:', error);
          //   setCloseChecker(false)
          //   // setError(true)
          //   setOpen(true)
          //   setBaloonData('error')
          //   setLoading(false)
          // }
        setBaloonData('error')
        setLoading(false)
        setOpen(true)
        setCadastrNumber()
        setOnCkickCadastrNumber('')
      }
      finally {
        loadingBarRef.current.complete(); // Завершаем прогресс-бар
      }

  };

  function convertCoords(coords) {
    return coords.map(item => {
      if (Array.isArray(item)) {
        if (item.length === 2 && typeof item[0] === 'number' && typeof item[1] === 'number') {
          // Если элемент - это пара координат, преобразуем их
          return coord3857To4326(item);
        } else {
          // Если элемент - массив, вызываем функцию рекурсивно
          return convertCoords(item);
        }
      }
      // Если элемент не массив, возвращаем его
      return item;
    });
  }

// Конвертация координат широты/долготы в EPSG:3857
function coord4326To3857(coord) {
    const X = 20037508.34; // Радиус Земли в метрах
    const lon = coord[1]; // Долгота
    const lat = coord[0]; // Широта
    const long3857 = (lon * X) / 180; // Долгота в метрах
    let lat3857 = lat + 90; // Центральная линия для широты
    lat3857 = lat3857 * (Math.PI / 360);
    lat3857 = Math.tan(lat3857);
    lat3857 = Math.log(lat3857);
    lat3857 = lat3857 / (Math.PI / 180);
    lat3857 = (lat3857 * X) / 180; // Широта в метрах
    return [lat3857, long3857];
}

function createBbox(center, zoom, size) {
  const [lat, lon] = coord4326To3857(center); // Преобразуем центр в метры
  // Расчет размера одного пикселя в метрах
  const initialResolution = 120000; // Разрешение для уровня зума 0 (в метрах на пиксель)
  const resolution = initialResolution / Math.pow(2, zoom); // Разрешение для текущего зума
  // Половина ширины и высоты в пикселях
  const halfWidth = (size.width / 2) * resolution; // ширина
  const halfHeight = (size.height / 2) * resolution; // высота
  // Вычисляем координаты bbox в EPSG:3857
  const bbox = [
      lon - halfWidth,   // Минимальная долготная координата (слева)
      lat - halfHeight,  // Минимальная широтная координата (внизу)
      lon + halfWidth,   // Максимальная долготная координата (справа)
      lat + halfHeight   // Максимальная широтная координата (вверху)
  ];
  return bbox
}

function coord3857To4326(coord) {
  const X = 20037508.34; // Максимальная долгота в метрах
  const long3857 = coord[0];  // Долгота в метрах
  const lat3857 = coord[1];    // Широта в метрах
  // Преобразование долготы
  const long4326 = (long3857 * 180) / X;
  // Преобразование широты
  let lat4326 = lat3857 / (X / 180);
  const exponent = (Math.PI / 180) * lat4326;
  lat4326 = Math.atan(Math.exp(exponent)) * (360 / Math.PI) - 90;
  return [lat4326,long4326];
}


  const onGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setState([latitude, longitude, 5])
      });
  }


  const onMapReady = (mapInstanse) => {
    ymaps.current = mapInstanse;
    setIsMapReady(true);
    onGeoLocation()
    mapRef.current.events.add("onloaddeck", () => {
      mapRef.current.setType('yandex#map,nspd-areas');
    });
  }

  const onLoadListBox = (listBoxInstanse) => {
    if (!listBoxInstanse || listBoxRef.current) return;
    listBoxRef.current = listBoxInstanse;
  }

  const onListSelected = (data, item) => {
    data?.forEach((item) => item.selected = false);
    item.selected = true;
    listBoxRef.current.collapse();
    const selectedType = listBoxRef.current.getAll()
      .filter((item) => item.isSelected())
      .map((item) => item.data.get('value'))
      .filter(Boolean)
      .toString()

    !!ymaps.current.mapType.storage.hash[selectedType] && mapRef.current.setType(selectedType);
  }

  const onClickListItem = (event, item) => {
    item.selected = false;
    listBoxRef.current.collapse();
    listBoxRef.current.getAll()
      .filter((item) => item.data.get('type') === event?.get('target').data?.get('type'))
      .map((item) => item?.state?.set('selected', false));
  }

  const focus = () => {
    ref?.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    setTimeout(() => {
      focus()
    }, 50)
  }, [cadastrNumber])

  return (
    <>
    <div className={style.object__block} id="infrastructura">
      <div className={style["object__block-wrap"]}>
        {/* <div className={style.adfinixBlock}>
          <div class="adfinity_block_13133"></div>
        </div> */}
        <LoadingBar
          color="#48a728"
          ref={loadingBarRef}
          height={6}
        />
        <div className={style["object__block-title"]}>
          {path === '/kadastrovaya-karta' || path === '/map' ?
          (districtsList ? <h2>Кадастровая карта {genetiveRegionName}</h2>:
            !city ? <h2>Кадастровая карта {regionName && ` района ${regionName}`} {genetiveRegionName}</h2>:
            !settlement ? <h2>Кадастровая карта {regionName && ` города ${regionName}`} {genetiveRegionName}</h2>:
            <h2>Кадастровая карта {settlementName} {regionName && ` района ${regionName}`} {genetiveRegionName}</h2>)
          : (districtsList ? <h2>Карта {genetiveRegionName}</h2>:
          !city ? <h2>Карта {regionName && ` ${cityFrom(regionName)} района`} {genetiveRegionName}</h2>:
          !settlement ? <h2>Карта {regionName && ` ${cityFrom(regionName)}`} {genetiveRegionName}</h2>:
          <h2>Карта {settlementName} {regionName && ` ${cityFrom(regionName)} района`} {genetiveRegionName}</h2>
          )}

        </div>
        <div className={style.houseDescription}>
          <p>Для более точного позиционирования и поиска объектов необходимо приблизить карту.</p>
        </div>

        <YMaps
          query={{ apikey: "c1669e56-36a2-4324-b11c-9f5939204015" }}
        >
          <div className={style.mapContainer}>
            {loading &&
              <div className={style.pulseLoader}>
                <PuffLoader color="#fff" size={60} />
              </div>
            }
            <Map
              modules={["Placemark", "geocode", "geoObject.addon.balloon", "Layer", "layer.storage", "projection.sphericalMercator", "mapType.storage", "MapType"]}
              instanceRef={mapRef}
              onLoad={(ympasInstance) => onMapReady(ympasInstance)}
              onClick={onMapClick}
              defaultState={{ center: [state[0], state[1]], zoom: state[2] }}
              // defaultState={{ center: [55.755864, 37.617698], zoom: 12 }}
              defaultOptions={{
                restrictMapArea: [[-83.8, -170.8], [83.8, 170.8]],
                suppressMapOpenBlock: true,
                yandexMapDisablePoiInteractivity: true,
                minZoom: 4,
                maxZoom: 20,
                autoFitToViewport: 'always',
                maxAnimationZoomDifference: 0,
              }}
              width="100%"
              height="700px"
            >
              <ZoomControl defaultOptions={{ float: "right" }} />
              {/* <FullscreenControl /> */}
              <div className={style.mapRollUp}>
              <ListBox
                instanceRef={(listBoxRef) => onLoadListBox(listBoxRef)}
                data={{ content: "Слои" }}
                options={{ float: "right" }}
                >

                {
                  mapTypes.baseLayers.map((item, index) =>
                    <ListBoxItem key={`list-group-1${index}`}
                      data={{ content: item.title, type: item.type, value: item.value }}
                      state={{ selected: item.selected }}
                      onClick={(data) => onClickListItem(data, item)}
                      onSelect={() => onListSelected(mapTypes.baseLayers, item)}
                    />
                  )
                }
                <ListBoxItem
                  options={{ type: 'separator' }}
                />
                {
                  mapTypes.cadastralBoundaries.map((item, index) =>
                    <ListBoxItem key={`list-group-2${index}`}
                      data={{ content: item.title, type: item.type, value: item.value }}
                      state={{ selected: item.selected }}
                      onClick={(data) => onClickListItem(data, item)}
                      onSelect={() => onListSelected(mapTypes.cadastralBoundaries, item)}
                    />
                  )
                }
                <ListBoxItem
                  options={{ type: 'separator' }}
                />
                {
                  mapTypes.thematicLayers.map((item, index) =>
                    <ListBoxItem key={`list-group-3${index}`}
                      data={{ content: item.title, type: item.type, value: item.value }}
                      state={{ selected: item.selected }}
                      onClick={(data) => onClickListItem(data, item)}
                      onSelect={() => onListSelected(mapTypes.thematicLayers, item)}
                    />
                  )

                }
              </ListBox>
              </div>
              {bbox &&
              <Polygon
                geometry={bbox}
                options={{
                  fillColor: '#00FF00', // Светло-зеленый цвет заливки
                  strokeColor: '#45c587', // Зеленый цвет границы
                  strokeWidth: 4,
                  opacity: 0.3
                }}
              />}
            </Map>
          </div>
          {isMapReady &&
            <>
              <YMapsDeck
                props={{ mapRef, ymaps, imageLayer, state }}
              >
              </YMapsDeck>
              <YMapsLayers props={{ ymaps }} />
            </>
          }
        </YMaps>

        {(baloonData && baloonData !== 'error') &&
          <div className={`${style.reestrMapContent}`} ref={ref}>
                <div className={style.info__header} >
                  <div className={style.searchIcon}>
                  <CloseIcon
                    onClick={() => {
                      setError(false)
                      setOpen(false)
                      setBaloonData('')
                      setCadastrNumber('')
                      setOnCkickCadastrNumber('')
                    }}
                  />
                  </div>
                </div>
                <Link to="egrn" smooth="true" activeClass="active" spy={true} duration={500} className={`${style["test__rightblock_btnb"]} ${style["test__rightblock_btnb--img"]}`}>
                  <div className={style.info__content}>
                      {/* <div className={style["test__rightblock_btnb-img"]}> Заказать отчеты {String.fromCharCode(9660)}</div> */}
                    <div className="stack" style={{'--stacks': 3}}>
                      <span style={{'--index': 0}}>Выбрать отчеты {String.fromCharCode(9660)}</span>
                      <span style={{'--index': 1}}>Выбрать отчеты {String.fromCharCode(9660)}</span>
                      <span style={{'--index': 2}}>Выбрать отчеты {String.fromCharCode(9660)}</span>
                    </div>
                  </div>
                </Link>
                <div className={style.promoContainerPkk} id="upTo">
                  <PromoCode setPromoCode={setPromoCode} cadNumber={cadastrNumber || onCkickCadastrNumber} promoCode={promoCode} setActivate={setActivate} activate={activate} setVisible={setIsVisible} isVisible={isVisible}/>
                </div>
                <div className={style["info__table-wrap"]}>
                <div className={style.adfinixBlock}>
                   <div className="adfinity_block_14878"></div>
                  </div>
                  <table className={style.info__table}>
                    <tbody key={cn}>
                      {outputObject()}
                    </tbody>
                  </table>

                  {historyCadCost.length > 1 && <div className={style.costHistory1}>
                    {/* <table className={style.info__table}>
                        <tbody>
                          <tr><td><span>Изменение кадастровой стоимости:</span></td></tr>
                        </tbody>
                    </table> */}
                    <ChartCadCostHistory data={historyCadCost}/>
                </div>}
                </div>
                {/* <div className={style.info__content}>
                  <div className={style.historyInfo2}><p><strong>Внимание! </strong>публичная кадастровая информация носит исключительно справочный характер. Подробные актуальные сведения об объекте недвижимости, кадастровой стоимости, а так же данные о возможных обременениях и собственниках доступны по запросу в отчетах.{String.fromCharCode(9660) + String.fromCharCode(9660) + String.fromCharCode(9660)}</p>
                  </div>
                </div> */}
                <div className={style.info__orel}></div>
          </div>
        }
        {baloonData === 'error' &&
          <div className={`${style.reestrMapContent3}`}>
                <div className={style.info__header} ref={ref}>
                    <div className={style.searchIcon}>
                      <CloseIcon
                        onClick={() => {
                          setError(false)
                          setBaloonData('')
                          setOpen(false)
                          setCadastrNumber('')
                        }}
                    />
                  </div>
                </div>
                <div className={style.adfinixBlock}>
                  <div className="adfinity_block_14878"></div>
                </div>
                <div className={style.info__content}>
                  <div className={style.info__main}>
                    <div className={style["info__main-title"]}>По данным кординатам ничего не найдено. Причины:</div>
                    {/* <div className={style["info__main-address"]}></div> */}
                  </div>
                </div>
                <div className={style["info__table-wrap"]}>
                  <table className={style.info__table}>
                    <tbody>
                      {outputObject1()}
                    </tbody>
                  </table>
                </div>
                <div className={style.adfinixBlock}>
                  <div className="adfinity_block_14878"></div>
                </div>
          </div>
        }
        {/* {cadastrNumber && <CheckRaports cadNum={cadastrNumber} owner={owner} rightsCheck={rightsCheck} promoCode={promoCode} sendActivePromoCode={sendActivePromoCode} setPromoCode={setPromoCode} setActivate={setActivate} activate={activate}/>} */}
      </div>
    </div >
    {/* <div className={style.object__block} id="infrastructura">
      <div className={style["object__block-wrap"]}>
        <div className={style.adfinixBlock}>
          <div class="adfinity_block_13133"></div>
        </div>
      </div>
    </div> */}
    </>
  )
}

export default PpkMap
import { useEffect, useState, useRef } from 'react'
import { YMaps, Map, TypeSelector, ZoomControl, Placemark, FullscreenControl, ListBox, ListBoxItem, Polygon } from '@pbe/react-yandex-maps'
import { mapTypes } from './files/constants/map-types.constant';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PuffLoader from "react-spinners/PuffLoader";
import Link from 'next/link';
import style from '../styles/File.module.css';
import YMapsDeck from './ymapsDeck';
import YMapsLayers from './ymapsLayers';
import { getLayers } from './files/constants/build-type-layer.constant';
import CheckRaports from './checkRaports';
import CloseIcon from '@material-ui/icons/Close';
import { set } from 'mobx';
import PromoCode from './promoCode';


const PpkMapWidget = ({ cadastrNumber, setCloseChecker, setAlarmMessage, setCadastrNumber, flatRights, setPromoCode, promoCode, setActivate, activate, lat, lon, rightsCheck, owner, sendActivePromoCode, closeChecker, setLoading, loading, setBaloonData, baloonData, genetiveRegionName, regionName, districtsList, city, settlement, settlementName, onCkickCadastrNumber, setOnCkickCadastrNumber, setIsVisible, isVisible }) => {
  const router = useRouter();
  const [bbox, setBbox] = useState(null);
  const [imageLayer, setImageLayer] = useState(null);
  const [state, setState] = useState([lat || 55.755864, lon ||37.617698, 13]);
  // const [baloonData, setBaloonData] = useState('');
  // const [loading, setLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const ymaps = useRef(null);
  const placemarkRef = useRef(null);
  const mapRef = useRef(null);
  const listBoxRef = useRef(null);
  const ref = useRef(null);
  const rights = flatRights?.realty?.rights || flatRights?.rights?.realty?.rights;
  const encumbrances = flatRights?.realty?.encumbrances || flatRights?.rights?.realty?.encumbrances
  const status = baloonData?.features?.[0]?.properties?.options?.previously_posted
  const permittedUse = baloonData?.features?.[0]?.properties?.options?.permitted_use_established_by_document
  const address = baloonData?.attrs?.address || baloonData?.features?.[0]?.properties?.options?.readable_address
  const area_value = baloonData?.attrs?.area_value || baloonData?.features?.[0]?.properties?.options?.land_record_area
  const cad_cost = baloonData?.attrs?.cad_cost || baloonData?.features?.[0]?.properties?.options?.cost_value
  const cn = baloonData?.attrs?.cn || baloonData?.features?.[0]?.properties?.options?.cad_num
  const kvartal = baloonData?.attrs?.kvartal
  const util_by_doc = baloonData?.attrs?.util_by_doc || baloonData?.features?.[0]?.properties?.options?.land_record_category_type
  const parcel_type = baloonData?.attrs?.parcel_type
  const surveying = baloonData?.surveying
  const cost_registration_date = baloonData?.features?.[0]?.properties?.options?.cost_registration_date
  const askPpk = async () => {
    setLoading(true)
    setCloseChecker(false)
    setAlarmMessage(false)
    const nspdData = await axios(`/api/nspdCadNumData?cadNumber=${cadastrNumber}`)
    const objectData = nspdData?.data?.data
    if (nspdData?.data?.features?.length !== 0 && nspdData?.data?.length !== 0) {
      const coordinate = nspdData?.data?.data?.features?.[0]?.geometry?.coordinates
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
      const centerCoordinates = getPolygonCenter(outerCoordinates);


      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates([centerCoordinates?.[0], centerCoordinates?.[1]]);
      } else {
        placemarkRef.current = createPlacemark([centerCoordinates?.[0], centerCoordinates?.[1]]);
        mapRef.current.geoObjects.add(placemarkRef.current);
      }

      setState([centerCoordinates?.[0], centerCoordinates?.[1], 18])
      setBaloonData(objectData)
      setCloseChecker(true)
      setLoading(false)
      setBbox(convertedCoordinate)

    } else {
      setOnCkickCadastrNumber('')
      setCadastrNumber('')
      setCloseChecker(false)
      setAlarmMessage(true)
      // setState([lat || '55.751574', lon ||'37.573856', 9])
      setBaloonData('')
      setLoading(false)
    }
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


  const paramInfo = {
    // 'Тип объекта': [parcel_type === 'parcel' ? 'Земельный участок' : 'ОКС'],
    'Тип объекта': 'Земельный участок',
    'Категория земель': util_by_doc,
    'Разрешенное использование': permittedUse,
    'Кадастровый номер:': <b>{cn}</b>,
    // 'Кадастровый номер:': <b>{cn}</b>,
    'Кадастровый квартал': kvartal,
    'Адрес': address,
    'Декларируемая площадь': area_value && `${area_value} кв.м.`,
    'Кадастровая стоимость': `${cad_cost} рублей`,
    'Дата утверждения кадастровой стоимости': cost_registration_date,
    // 'Межевание': !surveying ? 'Нет сведений' : 'Проведено',

  }

  const paramInfo1 = {
    '1': 'Межевание не делалось вообще',
    '2': 'Межевание сделано давно (до 2006 года)',
    '3': 'Межевание сделано недавно (1-2 месяца назад)',
    '4': 'Технические ошибки кадастровой карты (требуется повторный поиск)',
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
        <tr><td>{it}</td><td><span>{paramInfo1[it]}</span></td></tr>
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








  const addImageLayers = (data) => {
    const { bounds, image } = data;
    setImageLayer([{ name: 'imageLayer', type: 'bitmap', visible: true, bounds, image, zIndex: 101 }]);
  }

  const createImageLayer = (data) => {
    const { extent } = data?.features?.[0] || data?.pkk;
    const { bbox, bounds } = buildBounds(extent);
    const image = buildUrlImage({ ...data?.features?.[0] || data?.pkk, bbox });
    addImageLayers({ bounds, image });
  }

  const onMapClick = async (event) => {
    setBbox(null)
    setLoading(true)
    setCadastrNumber('')
    setOnCkickCadastrNumber('')
    setCloseChecker(false)
    setAlarmMessage(false)
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


      try {
        const nspdResponse = await axios(`/api/nspdData?bbox=${bbox}`);
        const nspdData = nspdResponse.data;

        if (nspdData?.features?.length === 0) {
          setBaloonData('error')
          setLoading(false)
          setCadastrNumber()
          setOnCkickCadastrNumber('')
        } else {
          const cadastrNumber = nspdData?.features?.[0]?.properties?.options?.cad_num || nspdData?.features?.[0]?.properties?.externalKey
          const coordinate = nspdData?.features?.[0]?.geometry?.coordinates
          const convertedCoordinate = convertCoords(coordinate) // Конвертация координат широты/долготы в
          setBbox(convertedCoordinate)
          setBaloonData(nspdData)
          setCloseChecker(true)
          setLoading(false)
          setOnCkickCadastrNumber(cadastrNumber)
        }
      } catch (error) {
        setBaloonData('error')
        setLoading(false)
        setCadastrNumber()
        setOnCkickCadastrNumber('')
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

  return (
    <>
        <YMaps
          query={{ apikey: "f0cdbfca-58dd-4461-a61e-844a4939a303" }}
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
              height="500px"
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
                  fillColor: "#00FF00", // Светло-зеленый цвет заливки
                  strokeColor: '#45c587', // Зеленый цвет границы
                  strokeWidth: 4,
                  opacity: 0.5
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

        {baloonData && baloonData !== 'error' && !loading &&
          <div className={style.reestrMapContent2}>
                <div className={style.info__header} ref={ref}>
                  <div className={style.searchIcon}>
                  <CloseIcon
                    onClick={() => {
                      setAlarmMessage(false)
                      setBaloonData('')
                      setCadastrNumber('')
                      setOnCkickCadastrNumber('')
                    }}
                  />
                  </div>
                </div>
                <div className={style["info__table-wrap"]}>
                  <table className={style.info__table}>
                    <tbody key={cn}>
                      {outputObject()}
                    </tbody>
                  </table>
                </div>
                <div className={style.info__content}>
                  <Link href={`https://regrp.su/cn/${cn}`} target="_top" className={`${style["test__rightblock_btnb"]} ${style["test__rightblock_btnb--map"]}`}>
                    <div className={style["test__rightblock_btnb-img"]}> Заказать отчеты</div>
                  </Link>
                </div>
                <div className={style.info__content}>
                  <div className={style.historyInfo2}><p><strong>Внимание! </strong>Подробные актуальные сведения об объекте недвижимости, кадастровой стоимости, а так же данные о возможных обременениях и собственниках доступны по запросу в отчетах.</p>
                  </div>
                </div>
                <div className={style.info__orel}></div>
          </div>
        }
        {baloonData === 'error' &&
          <div className={style.reestrMapContent2}>
                <div className={style.info__header}>
                    <div className={style.searchIcon}>
                      <CloseIcon
                        onClick={() => {
                          setAlarmMessage(false)
                          setBaloonData('')
                          setCadastrNumber('')
                        }}
                    />
                  </div>
                </div>
                <div className={style.info__content}>
                  <div className={style.info__main}>
                    <div className={style["info__main-title"]}>На карте показываются только участки, для которых сделано межевание (т.е. измерены точные координаты углов).</div>
                    <div className={style["info__main-address"]}>Возможные причины:</div>
                  </div>
                </div>
                <div className={style["info__table-wrap"]}>
                  <table className={style.info__table}>
                    <tbody>
                      {outputObject1()}
                    </tbody>
                  </table>
                </div>
                <div className={style.info__orel}></div>
          </div>
        }
    </>
  )
}

export default PpkMapWidget
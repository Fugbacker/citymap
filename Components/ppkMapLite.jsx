import { useEffect, useState, useRef } from 'react'
import { YMaps, Map, TypeSelector, ZoomControl, Placemark, FullscreenControl, ListBox, ListBoxItem, Polygon} from '@pbe/react-yandex-maps'
import { mapTypes } from './files/constants/map-types.constant';
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


const PpkMapLite = ({ cadastrNumber, setCloseChecker, setAlarmMessage, setCadastrNumber, flatRights, setPromoCode, promoCode, setActivate, activate, lat, lon, rightsCheck, owner, sendActivePromoCode, closeChecker, setBaloonData, baloonData, genetiveRegionName, regionName, districtsList, city, settlement, settlementName}) => {
  const router = useRouter();
  const [bbox, setBbox] = useState(null);
  const [imageLayer, setImageLayer] = useState(null);
  const [state, setState] = useState([lat || 55.755864, lon || 37.617698, 13]);
  // const [baloonData, setBaloonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const ymaps = useRef(null);
  const placemarkRef = useRef(null);
  const mapRef = useRef(null);
  const listBoxRef = useRef(null);

  const askPpk = async () => {
    // setOpen(false)
    // setLoading(true)
    // setCloseChecker(false)
    // setError(false)
    try {
      const nspdData = await axios(`/api/nspdCadNumData?cadNumber=${cadastrNumber}`)
      const objectData = nspdData?.data?.data
      if (nspdData?.data?.features?.length !== 0 && nspdData?.data?.length !== 0) {
        const coordinate = nspdData?.data?.data?.features?.[0]?.geometry?.coordinates
        const check = nspdData?.data?.data?.features?.[0]?.geometry?.type === "Polygon"
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
        check ? centerCoordinates = getPolygonCenter(outerCoordinates) : centerCoordinates = convertCoords([coordinate]);


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
        check ? setBbox(convertedCoordinate) : setBbox(convertCoords([coordinate]))


      } else {
        const pkkData = await axios(`/api/geodecoder?cadNumber=${cadastrNumber}`)
          try {
            if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
              setBaloonData(pkkData?.data?.pkk)
              setCloseChecker(true)
              setLoading(false)
              setOpen(true)
              setBbox(coordinates)
            return
            } else {

              setCadastrNumber('')
              setCloseChecker(false)
              // setError(true)
              setBaloonData('error')
              setLoading(false)
              setOpen(true)
            }
          } catch {
            setCadastrNumber('')
            setCloseChecker(false)
            // setError(true)
            setBaloonData('error')
            setLoading(false)
            setOpen(true)
          }
      }
    } catch {
      const pkkData = await axios(`/api/geodecoder?cadNumber=${cadastrNumber}`)
      try {
        if (pkkData.data !== 'error' && pkkData.data?.pkk !== null) {
          setBaloonData(pkkData?.data?.pkk)
          setCloseChecker(true)
          setLoading(false)
          setOpen(true)
          setOnCkickCadastrNumber(cadastrNumber)
          // setBbox(coordinates)
        return
        } else {
          setOnCkickCadastrNumber('')
          setCadastrNumber('')
          setCloseChecker(false)
          // setError(true)
          setBaloonData('error')
          setOpen(true)
          setLoading(false)
        }
      } catch {
        setOnCkickCadastrNumber('')
        setCadastrNumber('')
        setCloseChecker(false)
        setError(true)
        setBaloonData('error')
        setOpen(true)
        setLoading(false)
      }
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

  return (
    <div className={style.object__block} id="infrastructura">
      <div className={style["object__block-wrap"]}>
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
            // onClick={onMapClick}
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
            height="200px"
          >
            <ZoomControl defaultOptions={{ float: "right" }} />
            {/* <FullscreenControl /> */}
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
      </div>
    </div >
  )
}

export default PpkMapLite
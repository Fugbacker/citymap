import { useEffect, useState, useRef } from 'react'
import { YMaps, Map, TypeSelector, ZoomControl, Placemark, FullscreenControl, ListBox, ListBoxItem, Panorama } from '@pbe/react-yandex-maps'
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


const PpkMapLiteReport = ({ cadastrNumber, setCloseChecker, setAlarmMessage, setCadastrNumber, flatRights, setPromoCode, promoCode, setActivate, activate, lat, lon, rightsCheck, owner, sendActivePromoCode, closeChecker, setBaloonData, baloonData, genetiveRegionName, regionName, districtsList, city, settlement, settlementName}) => {
  const router = useRouter();
  const [imageLayer, setImageLayer] = useState(null);
  const [state, setState] = useState([lat || 55.755864, lon || 37.617698, 13]);
  // const [baloonData, setBaloonData] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const ymaps = useRef(null);
  const placemarkRef = useRef(null);
  const mapRef = useRef(null);
  const listBoxRef = useRef(null);

  const askPpk = async () => {
    setLoading(true)
    setCloseChecker(false)
    const pkkData = await axios(`/api/geodecoder?cadNumber=${cadastrNumber}`)

    pkkData.data.pkk && createImageLayer(pkkData?.data);
    if (pkkData.data !== 'error') {
      // if (pkkData.data?.pkk?.center === null || pkkData.data?.pkk?.feature?.center === null) {
      //   router.push(`/kadastr/${cadastrNumber}`)
      // }
      if (placemarkRef.current) {
        placemarkRef.current.geometry.setCoordinates([pkkData?.data?.latitude?.y, pkkData?.data?.latitude?.x]);
      } else {
        placemarkRef.current = createPlacemark([pkkData?.data?.latitude?.y, pkkData?.data?.latitude?.x]);
        mapRef.current.geoObjects.add(placemarkRef.current);
      }

      setState([pkkData?.data?.latitude?.y, pkkData?.data?.latitude?.x, 18])
      setBaloonData(pkkData?.data?.pkk)
      setCloseChecker(true)
      setLoading(false)
    } else {
      setCloseChecker(false)
      setAlarmMessage(true)
      setState([lat || '55.751574', lon ||'37.573856', 9])
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


  function convertCoordinates(point) {
    return [(2 * Math.atan(Math.exp(point[1] / 6378137)) - Math.PI / 2) / (Math.PI / 180), point[0] / (Math.PI / 180.0) / 6378137.0];
  }

  const buildBbox = (extent) => {
    let dx = extent?.xmax - extent?.xmin;
    let dy = extent?.ymax - extent?.ymin;
    const bbox = `${extent?.xmin},${extent?.ymin},${extent?.xmax},${extent?.ymax}`;
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

  const buildUrlImage = (data) => {
    const { bbox, attrs, type } = data;
    return `https://xn--j1aan.xn--80asehdb/map-w-pkk/api/rosreestr/cadastre-selected.php?bbox=${bbox}&id=${attrs.id}&type=${type}&layerDefs=${getLayers(type, attrs.id)}`
  }

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
      <div style={{ marginBottom: '15px', padding: '10px 0' }}>
      <div style={{ display: 'table', width: '100%' }}>
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
    </>
  )
}

export default PpkMapLiteReport
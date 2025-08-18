import { YMaps, Map, TypeSelector, ZoomControl, Placemark, Panorama } from '@pbe/react-yandex-maps';
import style from '../styles/File.module.css';

const MkdMapLite = ({ dcHouse }) => {
  const dc = dcHouse
  const lat =  dc?.lat
  const lng =  dc?.lon
  return (
    <div className={style.object__block} >
      <div className={style["object__block-wrap"]}>
          <YMaps
            options={{
              mapAutoFocus: true,
              autoFitToViewport: 'always'
            }}
          >
            <div className={style.mapContainer}>
              <Map defaultState={{ center: [lat, lng], zoom: 17 }}
                width="100%"

                >
                <TypeSelector options={{ float: 'right' }} />
                <ZoomControl options={{ float: 'right' }} />
                {/* <FullscreenControl /> */}
                <Placemark
                  geometry={[lat, lng]}
                  options={{
                    preset: 'islands#blueHomeIcon',
                    iconColor: '#00000'
                  }}
                />
              </Map>
            </div>
          </YMaps>
        </div>
      </div>
   )
}
export default MkdMapLite


import { YMaps, Map, TypeSelector, ZoomControl, Placemark} from '@pbe/react-yandex-maps';


const MkdMap = ({ mkd, obj, dcHouse, askDadata, jkh}) => {
  const dadata = askDadata && JSON.parse(askDadata)
  const object = obj && JSON.parse(obj)
  const dc = dcHouse && JSON.parse(dcHouse)
  const mkdObject = mkd && JSON.parse(mkd)
  const jkhData = jkh && JSON.parse(jkh)
  const lat = mkdObject?.lat || object?.dadata?.geo_lat || dc?.lat || dadata?.geo_lat || jkhData?.data?.address?.data?.geo_lat
  const lng = mkdObject?.lon || object?.dadata?.geo_lon || dc?.lon || dadata?.geo_lon || jkhData?.data?.address?.data?.geo_lon

  return (
      <div className="object__block" id="infrastructura">
        <div className="object__block-wrap">
          <div className="object__block-title _map">
            <h2>Карта</h2>
          </div>
          <div className="flatTableHead">
            {jkh ? <div className="jkhAddress">Офис управляющей компании: {lat}, {lng}</div> : <div className="jkhAddress">Координаты объекта недвижимости: {lat}, {lng}</div>}
          </div>
          <YMaps
            options={{
              mapAutoFocus: true,
              autoFitToViewport: 'always'
            }}
          >
            <div className="mapContainer">
              <Map defaultState={{ center: [lat, lng], zoom: 17 }}
                width="100%"
                height="400px"
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
export default MkdMap


import React, { useState, useEffect } from 'react'
import { YMaps, Map, TypeSelector, ZoomControl, Placemark, Circle, Clusterer} from 'react-yandex-maps';
import { useRouter } from 'next/router'


const TestMap = ({ cadastrObj, obj }) => {
  const router = useRouter()
  const object = JSON.parse(obj)
  const [value, setValue] = useState(false)
  const [range, setRange] = useState(200)
  const lat = value?.price?.bld?.pos?.lat || value?.bld?.pos?.lat || object?.dadata?.geo_lat
  const lng = value?.price?.bld?.pos?.lng || value?.bld?.pos?.lng || object?.dadata?.geo_lon
  const social = value?.structures || value?.getAskStructure?.social
  const address =  object?.objectData?.objectAddress?.addressNotes || object?.objectData?.objectAddress?.mergedAddress

  const tryTouchPromise = async () => {
    const a = await cadastrObj
    setValue(a)
  }

  tryTouchPromise()

  const uniqueKey = () => (+new Date())

  const landsIcon = (socialObj) => {
    if(socialObj.category === 'Продукты') {return 'islands#blueShoppingIcon'}
    if(socialObj.category === 'Образование') {return 'islands#blueEducationIcon'}
    if(socialObj.category === 'Медицина') {return 'islands#blueMedicalIcon'}
    if(socialObj.category === 'Спорт') {return 'islands#blueSportIcon'}
    if(socialObj.category === 'Развлечения') {return 'islands#blueTheaterIcon'}
    return 'islands#blueHomeIcon'
  }

  return (
    <>
      {(!lat) ? (
        <>
          {''}
          {/* <div className="searchTitle">Загружаем карту</div>
          <div className="spinner1" /> */}
        </>
      ) : (
        <div className="object__block" id="infrastructura">
          <div className="object__block-wrap">
            <div className="object__block-title _map">
              <h2>{address} на карте</h2>
            </div>
            <div className="flexMap">
              <div className="mapButtons">
                <p>Отфильтровать по расстоянию:</p>
                <div className="rightButton">
                  <button
                    type="button"
                    className="mapBtn green"
                    onClick={() => {
                      setRange(200)
                    }}
                  >
                    200
                  </button>
                  <button
                    type="button"
                    className="mapBtn yellow"
                    onClick={() => {
                      setRange(500)
                    }}
                  >
                    500
                  </button>
                  <button
                    type="button"
                    className="mapBtn red"
                    onClick={() => {
                      setRange(1000)
                    }}
                  >
                    900
                </button>
                </div>
              </div>
              <YMaps
                options={{
                  mapAutoFocus: true,
                  autoFitToViewport: 'always'
                }}
              >
                <div className="mapContainer">
                  <Map defaultState={{ center: [lat, lng], zoom: 16 }}
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
                    {social?.slice(0, -1).map((it, ind) => {
                      return (
                        <div key={ind}>
                          {it?.items[0]?.distance < range && (
                            <div key={uniqueKey()}>
                              <Clusterer
                                options={{
                                  preset: 'islands#greenClusterIcons',
                                  groupByCoordinates: false,
                                }}
                              >

                              {it.items.filter((distance) => distance.distance <= range).map((dataOfObject, index) => {
                                return (
                                  <div key={`${index + uniqueKey()}`}>
                                    <Placemark
                                      geometry={[dataOfObject.pos.lat, dataOfObject.pos.lng]}
                                      options={{
                                        preset: landsIcon(it)
                                      }}
                                      properties={{
                                        balloonContentHeader: "Заголовок",
                                        balloonContentBody: "Содержимое",
                                        balloonContentFooter: "Подвал",
                                        hintContent: "Подсказка"
                                      }}
                                    />
                                  </div>
                                )
                              })}
                              </Clusterer>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {/* <Circle
                      geometry={[[lat, lng], 1000]}
                      options={{
                        draggable: false,
                        fillColor: '#ff666622',
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWidth: 3,
                      }}
                    />
                    <Circle
                      geometry={[[lat, lng], 500]}
                      options={{
                        draggable: false,
                        fillColor: '#FFFF0022',
                        strokeColor: '#FFFF00',
                        strokeOpacity: 0.8,
                        strokeWidth: 3,
                      }}
                    /> */}
                    <Circle
                      geometry={[[lat, lng], 200]}
                      options={{
                        draggable: false,
                        fillColor: '#00800022',
                        strokeColor: '#008000',
                        strokeOpacity: 0.8,
                        strokeWidth: 3,
                      }}
                    />
                  </Map>
                </div>
              </YMaps>
              {/* добавление объектов инфраструктуры - начало */}
              {social?.slice(0, -1).map((it, ind) => {
                return (
                  <div key={ind}>
                    {it?.items[0]?.distance < range && (
                      <div>
                        <div key={uniqueKey()} className="object__block-title-2 products">{it.category}</div>
                        <div className="object__blockTable">
                          {it.items.filter((distance) => distance.distance <= range).map((item, index) => {
                            return (
                              <div key={`${index + uniqueKey()}`} className="object__blockTableTr">
                                <div className="object__blockTableTd map">
                                  <span className="titleOfitem">
                                    {`"${item.title}"`}
                                  </span>
                                  <span>
                                    {`   ${item.subtitle}`}
                                  </span>
                                </div>
                                <div className="object__blockTableTd map">{item?.address}</div>
                                <div className="object__blockTableTd map distance">{`${item?.distance} м`}</div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default TestMap


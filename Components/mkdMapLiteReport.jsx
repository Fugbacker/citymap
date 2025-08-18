import { YMaps, Map, TypeSelector, ZoomControl, Placemark, Panorama } from '@pbe/react-yandex-maps';
import style from '../styles/File.module.css';

const MkdMapLiteReport = ({ dcHouse }) => {
  const dc = dcHouse
  const lat =  dc?.lat
  const lng =  dc?.lon
  const mapImageUrl = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=650,200&z=17&l=map&pt=${lng},${lat},pm2rdl`;
  return (
    <>
    <div><h2>Расположение</h2></div>
    <div style={{ marginBottom: '15px', padding: '10px 0' }}>
      <div style={{ display: 'table', width: '100%' }}>
            <div className={style.mapContainer}>
              <img src={mapImageUrl} style={{ width: '100%'}}/>
            </div>
        </div>
      </div>
    </>
   )
}
export default MkdMapLiteReport


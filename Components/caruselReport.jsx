import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel, Autoplay, A11y, Lazy} from 'swiper';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import Image from 'next/image'
import style from '../styles/File.module.css'


const CaruselReport = ({ dcHouse }) => {
  const dcObj = JSON.parse(dcHouse)


  return (
  <>
    <div style={{marginBottom: '15px'}}>
        <div style={{textAlign: 'left'}}><h2>Фотографии многоквартирного дома</h2></div>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          {dcObj.house_photos.slice(0, 5).map((it, index) => {
            return (
              <img
                src={`https://img.dmclk.ru${it.storage_url}`}
                width={200}
                height={180}
                style={{marginRight: '20px'}}
                key={index}
              />
            )
            })}
          </div>
    </div>
  </>
  )
}

export default CaruselReport



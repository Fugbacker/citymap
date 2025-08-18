import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Mousewheel, Autoplay, A11y, Lazy} from 'swiper';
import  { useSession } from 'next-auth/react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image'
import style from '../styles/File.module.css'


const Carusel = ({ dcHouse }) => {
  const [model, setModel] = useState(false)
  const [tempImg, setTempImg] = useState('')
  const { data: session } = useSession()
  const getImg = (img) => {
    setTempImg(() => img)
    setModel(true)
  }
  const dcObj = JSON.parse(dcHouse)
  const countPhoto = dcObj?.house_photos?.length


  return (
  <>
    <div className={model ? 'model open' : 'model'}>
      <img src={tempImg} alt="" aria-hidden="true" onClick={() => setModel(false)} />
    </div>
    <div data-content="photo" id="photo" className={style.object__block}>
      <div className={style["object__block-wrap"]}>
          <div className={style.photoItems}>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, Mousewheel, Autoplay, A11y, Lazy]}
            lazy={{loadOnTransitionStart:false, loadPrevNext:false}}
            spaceBetween={14}
            slidesPerView={5}
            watchOverflow={true}
            navigation
            pagination={{ clickable: true }}
            mousewheel={{ sensitivity: 1}}
            preloadImages={false}
          >
            {dcObj.house_photos.map((it, index) => {
              const [imageLoaded, setImageLoaded] = useState(true);
              const handleImageError = () => setImageLoaded(false);
            return (
              imageLoaded && (
                <SwiperSlide className={style.photoItem} key={index} onClick={() => getImg(`https://img.dmclk.ru${it.storage_url}`)}>
                  <Image
                    src={`https://img.dmclk.ru${it.storage_url}`}
                    width={200}
                    height={180}
                    className="swiper-lazy"
                    onError={handleImageError} // Добавляем обработчик ошибки
                  />
                  <div className="swiper-lazy-preloader">
                    <span></span>
                  </div>
                </SwiperSlide>
              ))
            })}
          </Swiper>
          </div>
      </div>
    </div>
  </>
  )
}

export default Carusel



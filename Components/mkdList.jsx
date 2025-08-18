import React, { useState, useEffect, createRef, useRef } from 'react'
import MkdObject from './MkdObject'
import style from '../styles/File.module.css'

const MkdList = ({ mkdList, street, jkh }) => {
  const streetData = street ? JSON.parse(street) : undefined
  const allMkdByStreet = mkdList ? JSON.parse(mkdList) : undefined
  const mkdCount = allMkdByStreet?.length
  const alarmMkd = allMkdByStreet.filter((it) => {
    return it.is_alarm === 'Да'
  })

  // записываем в стэйт массив с объектами по 5 объектов при каждом вызове функции
  const [posts, setPosts] = useState({ data: [], page: 0 })
  const getNewPosts = () => {
    if (allMkdByStreet && posts.page >= allMkdByStreet?.length) {
      setPosts({ data: [], page: 0 })
    } else {
      if(allMkdByStreet) {
        const newArrayOfmkd = allMkdByStreet.slice(posts.page + 4, posts.page + 9)
        setPosts({
          data: [...posts.data, ...newArrayOfmkd ],
          page: posts.page + 5
        })
      }
    }
  }

  const lastItem = createRef()
  const observerLoader = useRef()
  const actionInSight = (entries) => {
    if (entries[0].isIntersecting && posts.page <= allMkdByStreet.length - 1 ) { // записываем в стэейт объекты пока post.page меньше длины массива
      getNewPosts();
    }
  }

  useEffect(() => {
    if (observerLoader.current) {
      observerLoader.current.disconnect();
    }
    observerLoader.current = new IntersectionObserver(actionInSight);
    if (lastItem.current) {
      observerLoader.current.observe(lastItem.current);
    }
  }, [lastItem])



  return ( allMkdByStreet && allMkdByStreet.length !== 0 &&
    <div className={style.mkdLists}>
      <div className={style["object__block-wrap"]}>
        <div className={style["object__block-title"]}><h2>{streetData?.shortname ? (`Дома на ${streetData.shortname}. ${streetData.formalName}`) : (jkh ? ('Дома под управлением') : ('Дома на этой улице'))}</h2></div>
        <div className={style.flatTableHead}>
          <div className={style.mkdCount}> {mkdCount && (`Найдено домов - ${mkdCount} шт.`)}</div>
          {alarmMkd.length !==0 && (<div className={style.alarmHouse}>{`${alarmMkd.length} из них признаны аварийными`}</div>)}
        </div>
        <header className={style.operatorHeader}>
          <div className={style.operatorCode1}>Состяние</div>
          <div className={style.diapazon1}>Год</div>
          <div className={style.operator1}>Адрес</div>
          {/* <div className="region1">Ссылка</div> */}
        </header>
        <div className={style.mkdList}>
          {allMkdByStreet.slice(0, 10).map((it, index) => {
            return <MkdObject key={index} mkd={it} />
          })}
          {posts.data.map((it, index) => {
            if (index + 5 === posts.data.length) {
              return <MkdObject key={it.id} mkd={it} ref={lastItem}/>
            }
            return (
              <MkdObject key={index} mkd={it} />
            )
          })
          }
        </div>
        <div className={style.flatBtn}>
            <button
              type="button"
              className={style.egrnButton}
              onClick={() => getNewPosts()}
            >
              {posts.page >= 5 ? 'Cкрыть' : 'Посмотреть все дома' }
            </button>
          </div>
      </div>
    </div>
  )
}

export default MkdList
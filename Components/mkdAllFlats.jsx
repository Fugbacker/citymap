import React, { useState } from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import style from '../styles/File.module.css'

export default function MkdAllFlats({ number, mkd, setCheckFlats }) {
  const [loading, setLoading] = useState({})
  const mkdHouse = mkd && JSON.parse(mkd)

  const flatList = mkdHouse?.flatList.sort((a, b) => a.apartment - b.apartment)
  const address = mkdHouse?.address

  const houseNumber = (number + '||').toUpperCase()
  const addressMkd = mkdHouse.address || mkdHouse?.objectData?.objectAddress?.addressNotes || mkdHouse?.objectData?.objectAddress?.mergedAddress

  const livingCount = flatList && (flatList?.filter((it) => {
    return it.apartment
  }).length)

  const clearFlatsArray = flatList && (flatList?.filter((it) => {
    return it.apartment
  }))


  if (clearFlatsArray && clearFlatsArray.length !==0) {
    setCheckFlats(true)
  }

  // записываем в стэйт массив с объектами по 5 объектов при каждом вызове функции
  // const [posts, setPosts] = useState({ data: [], page: 0 })
  // const getNewPosts = () => {
  //   if (clearFlatsArray && posts.page >= clearFlatsArray?.length) {
  //     setPosts({ data: [], page: 0 })
  //   } else {
  //     if(clearFlatsArray) {
  //       const newArrayOfFlatts = clearFlatsArray.slice(posts.page + 10, posts.page + 15)
  //       setPosts({
  //         data: [...posts.data, ...newArrayOfFlatts ],
  //         page: posts.page + 5
  //       })
  //     }
  //   }
  // }

  // const lastItem = createRef()
  // const observerLoader = useRef()
  // const actionInSight = (entries) => {
  //   if (entries[0].isIntersecting && posts.page <= flatList.length - 1 ) { // записываем в стэейт объекты пока post.page меньше длины массива
  //     getNewPosts();
  //   }
  // };

  // useEffect(() => {
  //   if (observerLoader.current) {
  //     observerLoader.current.disconnect();
  //   }
  //   observerLoader.current = new IntersectionObserver(actionInSight);
  //   if (lastItem.current) {
  //     observerLoader.current.observe(lastItem.current);
  //   }
  // }, [lastItem]);

  return (flatList && flatList.length !== 0  && typeof flatList !== 'undefined' &&
    <div className={style.mkdFlats} id="mkd-All-Flats">
      <div className={style["object__block-wrap"]}>
        <div className={style["object__block-title"]}><h2>Реестр квартир</h2></div>
        <div className={style.flatTable}>
          <div className={style.flatTableHead}>
            <div className={style.houseAddress}>{addressMkd}</div>
            <div className={style.flatsCount}> {livingCount && (`Найдено квартир - ${livingCount} шт.`)}</div>
          </div>
          <div className={style.egrnDescription}>
            <p>
              Количество квартир: {livingCount} шт. Для каждой из них можно заказать <a href="/">отчеты</a> с техническим планом, <a href="/kadastrovaya_stoimost">справку о кадастровой
              стоимости</a> или отчет о собственниках. Отчеты позволят проверить квартиру на наличие обременений перед заключенимом сделки. Следует отметить, что реестр может содержать, как дубли по адресам, но с разными кадастровыми номерами,
              так и различного рода несовпадения по данным.
            </p>
          </div>
            <div>
              {flatList.map((it, index) => {
                return (
                  <a className={style.linkFlat}  key={index} href={`/kadastr/${it.objectCn}`}>
                  <div className={style.flat}>
                    <div
                      className={style.flatTableTr}
                      onClick={() => {
                        setLoading({ ...loading, [index]: true })
                      }}
                    >
                      <div className={`${style.flatTableTd} ${style.flatCadNum}`}>{it.objectCn}</div>
                      <div className={`${style.flatTableTd} ${style.flatAddress}`}>{`${address}, кв ${it.apartment}`}</div>
                      <button
                          className={style.egrnButton}
                          onClick={() => {
                            setLoading({ ...loading, [index]: true })
                          }}
                      >
                      {loading[index] ? (
                          <div className={style.pulseLoader3}>
                            <PulseLoader color="#48a728" size={7} />
                          </div>
                      ) : ('Перейти')}
                      </button>
                    </div>
                  </div>
                </a>
                )
              })}
            </div>
        </div>
      </div>
    </div>
  )
}

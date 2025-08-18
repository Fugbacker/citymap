import seoLinks from "../seoLinks"
import Link from "next/link"
import style from '../styles/File.module.css'

const SeoLinks = () => {

  function arrayRandElement(arr) {
    const randomNumber= Math.floor(Math.random() * arr.length)
    const secondRandomNumber= Math.floor(Math.random() * arr.length)
    const thirdRandomNumber= Math.floor(Math.random() * arr.length)
    const array = [arr[randomNumber], arr[secondRandomNumber], arr[thirdRandomNumber]]



      return (
        array.map((item, index) => {
          const regexp = /стоимост/i
          const checker = regexp.test(item)
          // if (checker) {
          //   return (
          //     <Link key={index} className={style.mkdLink1} href='https://regrp.su/kadastrovaya-stoimost'>
          //       <div className={style.objectListTr}>
          //         <div className={style.linkTd}>{item}</div>
          //       </div>
          //     </Link>
          //   )
          // }
          return (
          <Link href='https://amap.su/' key={index} className={style.mkdLink1}>
              <div className={style.objectListTr}>
                <div className={style.linkTd}>{item}</div>
              </div>
          </Link>
          )
        })
      )
}

  return (
    <div className={style.randomObjects1}>
      <div className={style.contentWrap}>
        <div className={style.randomObjectsTitle1}>Кадастровые сведения</div>
        <div className={style.objectList}>
          {arrayRandElement(seoLinks)}
        </div>
      </div>
    </div>
  )
}

export default SeoLinks

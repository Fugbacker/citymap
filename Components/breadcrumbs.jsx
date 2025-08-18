import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import style from '../styles/File.module.css'

const Breadcrumbs = ({ cadastrObj }) => {
  const router = useRouter()
  const path = router?.asPath
  const path2 = router?.query

  const cadObj = cadastrObj ? JSON.parse(cadastrObj) : null
  const addressNotes = cadObj?.objectData?.objectAddress?.mergedAddress || cadObj?.address || path2?.jkh
  return (
    <div className={style.object__breadcrumbs}>
      <ol className={style.breadcrumbs}>
        <li>
          <Link href="/" >
              <span>Главная</span>
          </Link>
        </li>
        <span className={style.__gt}>&gt;</span>
        <li>
        <Link href={path || path2} >
            <span>{addressNotes}</span>
        </Link>
        </li>
      </ol>
    </div>
  )
}

export default Breadcrumbs
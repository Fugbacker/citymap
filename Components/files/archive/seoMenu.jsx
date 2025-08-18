import React from 'react'
import Link from 'next/link'

const SeoMenu = () => {
  return (
    <ul className="seoMenuLinks">
      <li className="seoMenuLink">
        <Link  href="#">
          <a className="">
            Проверка недвижимости
          </a>
        </Link>
      </li>
      <li className="seoMenuLink">
        <Link  href="#">
          <a className="">
            Проверка собственника
          </a>
        </Link>
      </li>
      <li className="seoMenuLink">
        <Link  href="#">
          <a className="">
            Капитальный ремонт
          </a>
        </Link>
      </li>
      <li className="seoMenuLink">
        <Link  href="/mkd">
          <a className="">
            Реестр МКД
          </a>
        </Link>
      </li>
      <li className="seoMenuLink">
        <Link  href="/jkh">
          <a className="">
            Реестр ЖКХ
          </a>
        </Link>
      </li>
    </ul>
  )
}

export default SeoMenu



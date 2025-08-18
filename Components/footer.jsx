import React from 'react'
import Link from 'next/link'
import style from '../styles/File.module.css'

export const Footer = () => {
  return (
    <footer>
      <div className={style.layoutFooter}>
        <div className={style.footinfo}>
            <div className={style.footname}>
              <div className={style.header3}>cadmap.su</div>
              {/* <div className="h3">ИП Золотарев Е.А. ИНН 634003496894</div> */}
              <div>
                <span>E-mail: <span className={`${style["h-mylo"]}`} data-item1="cadmap.su" data-item2="admin"></span></span>
                {/* <span className=""><span className="h-mylo" data-item1="ИП Золотарев Е.А. ИНН 634003496894" ></span></span> */}
              </div>
            </div>
            <div>
              <p className={style.copy}>2015-2025 © Все права защищены. <a href="https://cadmap.su">cadmap.su</a><br/><br/>
              Сайт не является официальным сайтом, официальный сайт Росреестра - rosreestr.gov.ru
              </p>
              <div className={style.payLogo}></div>
            </div>
          </div>
          <div className={style.rigthContainer}>
            <div className={style.footLinkContainer}>
            <div className={style.footlink}>
              <div className={style.header3}>Информация</div>
              <menu>
                <li><a href="/" title="Отчет из ЕГРН">Главная</a></li>
                {/* <li><a href="/contacts" title="">Контакты</a></li> */}
                <li><a href="/privacy-policy" title="">Политика конфиденциальности</a></li>
                <li><a href="/agreement" title="">Пользовательское соглашение</a></li>
                <li><a href="/public-offer" title="">Оферта</a></li>
                {/* <li><a href="/info" title="Информационный раздел">Информационный раздел</a></li> */}
              </menu>
            </div>
            {/* <div className={style.footnav}>
              <div className={style.header3}>Налоговые сервисы</div>
              <menu>
                <li><a href="/" title="Выписка из ЕГРН">Выписка из ЕГРН</a></li>
                <li><a href="/" title="Выписка из ЕГРН">Выписка из ЕГРЮЛ</a></li>
                <li><a href="/" title="Выписка из ЕГРН">Проверка контрагента</a></li>
                <li><a href="/" title="Выписка из ЕГРН">Проверка паспорта</a></li>
              </menu>
            </div> */}
            {/* <div className={style.footnav}>
              <div className={style.header3}>Сервисы</div>
              <menu>
                <li><a href="/kadastrovaya_stoimost" title="Справка о кадастровой стоимости">Справка о кадастровой стоимости</a></li>
                <li><a href="/adres_po_kadastrovomu_nomeru" title="Узнать кадастровый номер по адресу">Кадастровый номер</a></li>
                <li><a href="/kadastrovaya-karta" title="публичная кадастровая карта">Кадастровая карта</a></li>
                <li><a href="/spravochnaya_informaciya" title="справочная информация по объектам недвижимости в режиме online">Справочная информация</a></li>
                <li><a href="/zemelnie-uchastki" title="земельные участки">Земельные участки</a></li>
              </menu>
            </div> */}
          </div>
          <div className={`${style["footer__top-contacts"]}`}>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Время работы:</div>
              <div className={`${style["footer__top-contacts-data"]}`}>Понед.- Пятница с<br/>10:00 до 20:00</div>
            </div>

            <Link  className={style.tgLink} href="https://t.me/goskadastrBot">
              <div className={`${style["footer__top-contactsTd"]}`}>
                <div className={`${style["footer__top-contacts-title"]}`}>Telegram:</div>
                <div className={`${style["footer__top-contacts-data"]} ${style.disable}`}>
                  <div className={`${style["footer__top-contacts-soc"]} ${style._tg}`}></div>
                </div>
              </div>
            </Link>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Почта для обращений:</div>
              <div className={`${style["footer__top-contacts-data"]} ${style._email}`}><span>e-mail: <span className={`${style["h-mylo"]}`} data-item1="cadmap.su" data-item2="admin"></span></span></div>
            </div>
            <div className={`${style["footer__top-contactsTd"]}`}>
              <div className={`${style["footer__top-contacts-title"]}`}>Официальное приложене:</div>
              <div className={`${style["footer__top-contacts-data"]} ${style.disable}`}>
                <div className={`${style["footer__top-contacts-download"]} ${style._google}`}></div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </footer>
  )
}

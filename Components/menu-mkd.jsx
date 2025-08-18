import React from 'react'
import { Link } from 'react-scroll'

const MenuMkd = ({ mkd, jkh, flatChecker, dcHouse, number, repair, flatsCount }) => {
  const mkdMenu = mkd && JSON.parse(mkd)
  const jkhMenu = jkh && JSON.parse(jkh)
  const dcMenu = dcHouse && JSON.parse(dcHouse)
  const houseNumber = (number + '||').toUpperCase()
  const bldYear = mkdMenu?.built_year
  const bldTitle = mkdMenu?.house_type
  const photoCheck = dcMenu?.house_photos?.length
  const fullRating = dcMenu?.house_feedback?.total_rating

  return (
    <div className="object__leftMenu">
      <div className="object__leftMenu-wrap">
        <ul className="object__leftMenu-links">
          {photoCheck > 0 && (
            <li data-type="photo" className="object__leftMenu-link _success">
              <Link to="photo" smooth="true" activeClass="active" spy={true} duration={500}>Фотографии</Link>
            </li>
          )}
          {(bldYear || bldTitle) && (
            <li data-type="mkd" className="object__leftMenu-link _success">
              <Link to="mkd-info" smooth="true" activeClass="active" spy={true} duration={500}>МКД</Link>
            </li>
          )}
          {/* {repair  && (
            <li data-type="mkd" className="object__leftMenu-link _success">
              <Link to="cap-repair" smooth="true" activeClass="active" spy={true} duration={500}>Капитальный ремонт</Link>
            </li>
          )} */}
          {/* {fullRating !==0  && fullRating && (
            <li data-type="mkdRating" className="object__leftMenu-link _success">
              <Link to="mkdRating" smooth="true" activeClass="active" spy={true} duration={500}>Рейтинг МКД</Link>
            </li>
          )} */}
          {/* {jkhMenu && (
            <li data-type="arrest" className="object__leftMenu-link _success">
              <Link to="jkh" smooth="true" activeClass="active" spy={true} duration={500}>Управляющая компания</Link>
            </li>
          )} */}
           {/* {checker && (
            <li data-type="map" className="object__leftMenu-link _success">
              <Link to="infrastructura" smooth="true" activeClass="active" spy={true} duration={500}>Карта</Link>
            </li>
           )}  */}
          {flatChecker && (
            <li data-type="map" className="report">
              <Link to="mkd-All-Flats" smooth="true" activeClass="active" spy={true} duration={500}>Квартиры</Link>
            </li>
          )}
            {/* <li data-type="map" className="report">
              <Link to="profi" smooth="true" activeClass="active" spy={true} duration={500}>Мастера по ремонту</Link>
            </li> */}
          {flatsCount && flatsCount.length !== 0 && <li data-type="egrn" className="object__leftMenu-link _success">
            <Link to="egrn" smooth="true" activeClass="active" spy={true} duration={500}>Реестр</Link>
          </li>}
        </ul>
      </div>
    </div>
  )
}

export default MenuMkd

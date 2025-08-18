import { Link } from 'react-scroll'

const Banner = ({ mkd }) => {
  const mkdObj = mkd && JSON.parse(mkd)
  const address = mkdObj?.address
  const rooms = mkdObj?.living_quarters_count

  return (
    <div>
      <div className="egrnBlock">
        <div className="bannerBlock-wrap">
        <h3 className="egrnTitle">Реестр квартир: {address}</h3>

          <div className="bannerDescription">
            <p className="repairInformation">
              Для данного многоквартирного дома, расположенного по адресу {address}, можно заказать реестр жилых помещений, который содержит:
            </p>
          </div>
          <div className="egrnInfo">
          <ul className="egrnList1">
            <li>Кадастровые номера всех найденых квартир</li>
            <li>Вид и наличие права собственности</li>
            <li>Количество собственников</li>
            <li>Вид собственников</li>
            <li>Дата регистрации права собственности</li>
            <li>Дата прекращения права собственности</li>
          </ul>
          <div className="egrnPhoto"></div>
        </div>
          <Link to="egrn" smooth="true" activeClass="active" spy={true} duration={500}>
            <button className="egrnButton">Перейти к реестру</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Banner

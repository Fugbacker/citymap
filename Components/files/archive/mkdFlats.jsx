import React from 'react'
// import Link from 'next/link'
import { Link } from 'react-scroll'

const MkdFlats = ({ flats, number }) => {
  const flatProps = JSON.parse(flats)
  const houseNumber = (number + '||').toUpperCase()
  const flatFoo = () => {
    if(flatProps.length !== 0) {
      const flatsList = flatProps.filter((it) => {
        return it.house === houseNumber && it.apartment
      }).slice(0, 5)
      return flatsList
    }
    return false
  }

  return ( flatFoo() && flatFoo().length !== 0 &&
    <div className="">
      <div className="pledge__sidebar-title">Квартиры этого дома</div>
        <div className="pledge__sidebar-nav1">
          {flatFoo() && flatFoo().map((it, index) => {
            return (
              <a key={index} href={`/object/${it.objectCn}`}>
                <div className="flatElement">
                  <p>{it.addressNotes}</p>
                  <span>{it.objectId}</span>
                </div>
              </a>
            )
          })}
        </div>
        <div className="pledge__sidebar-confirmation1">
          <Link  to="mkd-All-Flats" >
            <a className="jkh__contacts-button flex-jc">
              Посмотреть все квартиры
            </a>
          </Link>
        </div>
    </div>

  )
}

export default MkdFlats
import React, { forwardRef, useState }  from 'react'
import PulseLoader from "react-spinners/PulseLoader"
import Link from 'next/link'


const MkdAllFlatsItem = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false)
  const flatProps = props.flat
  const address = props.mkdAdress

  return ( flatProps &&
    <Link className={styled.linkFlat} href={`/object/${flatProps.objectCn}`} title={`справочная информация по объекту недвижимости ${flatProps.objectCn} в режиме online`}>
      <div className={style.flat} ref={ref}>
        <div
          className={style.flatTableTr}
          onClick={() => {
            setLoading(true)
          }}
        >
          <div className={`${style.flatTableTd} ${style.flatCadNum}`}>{flatProps.objectCn}</div>
          <div className={`${style.flatTableTd} ${style.flatAddress}`}>{`${address}, кв ${flatProps.apartment}`}</div>
          <button className="mkdButton">
          {loading ? (
              <div className="pulseLoader3">
                <PulseLoader color="#48a728" size={7} />
              </div>
          ) : ('Перейти')}
          </button>
        </div>
      </div>
    </Link>
  )
})
MkdAllFlatsItem.displayName = 'MkdAllFlatsItem'

export default MkdAllFlatsItem

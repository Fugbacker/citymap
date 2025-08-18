import React, { forwardRef, useState }  from 'react'
import { useRouter } from 'next/router'
import PulseLoader from "react-spinners/PulseLoader"
import Link from 'next/link'

const MkdObject = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const mkdProps = props.mkd
  const address = mkdProps?.address

  return ( mkdProps &&
      <a className="linkMkd"
        onClick={() => {
          setLoading(true)
        }}
        href={`/apartment/${mkdProps.region_id}|${mkdProps.id}`}
      >
      <div className="mkd" ref={ref}>
        <div className="operatorItem">
         {loading ? (
            <div className="pulseLoader5">
              <PulseLoader color="#48a728" size={9} />
            </div>
          ) : (
            <>
              <div className="operatorPrefix1">
                {mkdProps.is_alarm === 'Нет'
                  ? <div className="mkdTableTd mkdLiveGood" title="Дом не признан аварийным"></div>
                  : <div className="mkdTableTd mkdLiveBad" title="Дом признан аварийным"></div>
                }
              </div>
              <div className="operatorDiapazon1">
                <div className="numberLength">{mkdProps.built_year ? (`${mkdProps.built_year} год`) : ('год не указан')}</div>
              </div>
              <div className="operatorName1">
                {!address ?
                  (
                    <div className="operatorFullName1">{mkdProps.shortname_street}. {mkdProps?.formalname_street}, {mkdProps?.house_number}{mkdProps.letter ? (`, лит. ${mkdProps.letter}`):('')}</div>
                  )
                  :
                  (
                    <div className="operatorFullName1">{address}</div>
                  )
                  }
              </div>
            </>
           )}
          </div>
        </div>
      </a>
  )
})

MkdObject.displayName = 'MkdObject'

export default MkdObject

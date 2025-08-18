import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import PulseLoader from "react-spinners/PulseLoader";
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import tokenChange from '@/Components/files/tokenChanger';
import style from '../styles/File.module.css'

export const SearchMap = ({ cadastrData, setCadastrData, setCadastrNumber, closeChecker, setAlarmMessage, setBaloonData, referer, error, setError, type, setType }) => {
  const tokenList = [
    'Token 431c3958f002f6f546afe128257059d372093aa2',
    'Token 1a86eedfc8da905b34669e441476d13d8ccc4691',
    'Token 0d5ab8f4aabc1cc02c29b2d759e0ebde7254a4b7',
    'Token 3ed91c052b049be7c81567f637a421153fd2a893',
    'Token 70b8dda637580dd14625d9296f24945f2a6fc4f9',
    'Token cc6c5060a102fea6d7e9fca62b723140b71fe26d',
    'Token b34e052b0d7e9ee8ee4bed6e9b6c37f65c6bf19d',
    'Token d96100ae95f29bf1e836953ab1d8806f699b32bd',
    'Token 6a291d83c8ed3c8281aaafee31a428d2f940a71d',
    'Token 49980e6be947cdfe80036a77db0f66b77dd96ae7',
    'Token 52ef1d5d1b954edb1af7a2a3eae8161c9bd264df',
    'Token 05c00220a7232bd094fadc0b5a1ab6af62f4e41a',
    'Token 70d3df4ad16cae0cb6f0f7225761828a8a3ba64a',
    'Token a1117552cb0595ebdd01e46d5837cd1a59511111',
    'Token d84ce9eb14ad022fb65fd7a9906e97f1b3df72ab',
    'Token a37b9e2ef7a399570f1b656fb956a4fe2ad2e2d5',
    'Token 0344544a6b13dc4f0b4881e88cb984bb42e46201',
    'Token 99d85664544086556e48e31d6e67e6408b8a4890',
    'Token 47b5c71bc9319061d6ddbc82c1c1075abd03fb13',
    'Token 6b3b68c32a6a4b600de441ac7805b4fabcd9a82c',
    'Token 8d73c2037cae5fb6bb4b43f859fb03951078896b',
    'Token 7d97b3a80f0cfd528e02a49e8ab2b39e1773bad2',
    'Token be5dcd66a0314293f7a01e5dfdc25b00c6e33810',
    'Token d082d648fecf7a4c3bae43e28b7be74d887dfe48',
    'Token f9591c1f867a957941f6efb1ca397b56749a1add',
    'Token 753d1163dac51545737dd90a80d87e6464b844c5',
    'Token ff79b9085c2e90bd25ff143815bef8ef67677212',
    'Token 9789ca1e5389337a5c29ac91b0f5ac75a48e54b0',
    'Token d0709fc93bcee153a5dc58ec7f46eadc03a45e20',
    'Token a97c4c33be2a69cdd251a473b7beda77f3349cd1',
    'Token ace0f9445a4e997c57efb5b8e88baacb2b5681bf',
    'Token 7fe6af06c147026b067d591d41f4d7017249fc7e',
    'Token 2137ff943ecd4323d3372a860ef68016eca23bb8',
    'Token c8a4e3e4ab49f9d2fdbb3d7205d60da7341a8aec',
    'Token 37d9a76c0c7274876c6b313ee8fcc29d9fb191c7',
    'Token e59e4e2c1cb5e1db2dcfe755fde9a8be9a67ddab',
    'Token c3a171c84503ffb490b63d101c96bc3ab6e659a9',
    'Token 49679018ceb951cea68735016e944c33ae057cd8',
    'Token d6067f90bf1f41be35d65b93094d9d4686fa09a1',
    'Token 2485efe273219dc5a3e0f4a2a6851675f2371df1',
    'Token fe4c105a62b057d8529e2bd63c09187e43b21243',
    'Token f3e9e79b58d01a161fda1eb986adf7c497d471c8',
    'Token 76de9c35bdd842eaaec1abdaf6eed81b437a6fd7',
    'Token 59fdc62e98f96782296f0c65a068d636c5f2e54a',
    'Token 1f37543c1aaa9b0347a61c4d61acee85bd90f6ff',
    'Token 399bbcc15e2c74fdf6ddd53c045c6f944d0e9409',
    'Token 0d64f315d6eb60493107df9c40d58ece7b1d29b7',
   ]


  const router = useRouter()
  // const [error, setError] = useState(false)
  const [value, setValue] = useState([])
  const [validForm, setValidForm] = useState(false)
  const [validInput, setValidInput] = useState(false)
  const [enterText, setEnterText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState({})
  const [check, setCheck] = useState(true)
  const [token, setToken] = useState('Token 431c3958f002f6f546afe128257059d372093aa2')
  const [dadata, setDadata] = useState('')

  const region = dadata?.region_with_type
  const city = dadata?.city || null
  const settlement = dadata?.settlement || null
  const street = dadata?.street || null
  const house = dadata?.house || null
  const flat = dadata?.flat || null

  let fullAddress = `${region}|${city}|${settlement}|${street}|${house}|${flat}`

  useEffect(() => {
    localStorage.setItem('token', JSON.stringify(token))
    const now = new Date();
    const day = now.getDate();

    const handleRequest = async () => {
      const response = await fetch("https://dadata.ru/api/v2/findById", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 403) {
        // Токен исчерпал лимит запросов

        const tokenIndex = tokenList.indexOf(token)
        setToken(tokenList[tokenIndex+1]);
        localStorage.setItem('token', tokenList[tokenIndex+1]);
      }
        return response;
    }
    handleRequest()

    // Если наступили новые сутки, начинаем работу с первого в списке токена
    if (day !== now.getDate()) {
      setToken(tokenObj[0]);
      localStorage.getItem('token', JSON.stringify(tokenObj[0]))
      console.log('refresh token')
    }
  }, [token])

  const sendDataToServer = async (enterText) => {
    const regexp = /\d+\:\d+\:\d+\:\d+/g
    const checker = regexp.test(enterText)

    if (checker) {
      // router.push(`/kadastr/${enterText}`)
      // const url = `https://pkk.rosreestr.ru/api/features/1/${enterText}?date_format=%c&_=1688717978149`
      // await axios.get(url)
      // .then(({ data }) => {
      //   console.log('AHTUNGDATA', data)
      //   console.log('AHTUNG')
      //     setCadastrData(data.features)
      //     setLoading(false)
      //     setEnterText('')
      //     setLoader({})
      // })
      // .catch(() => {
      //   setError(true)
      //   setLoading(false)
      //   setEnterText('')
      //   setLoading(false)
      //   setLoader({})
      // })
      setCadastrNumber(enterText)
      setLoading(false)
      setEnterText('')
      setLoader({})
      setDadata('')
    }

    else {
      await axios.get(`/api/tooltips?text=${fullAddress}`)
      .then(({ data }) => {
        if (!data) {
          setError(true)
          setLoading(false)
          setEnterText('')
          setLoading(false)
          setLoader({})
          setCadastrNumber('')
          setBaloonData('')
          setDadata('')
        }
        else if (data.length !== 0 && data.length > 1) {
          setCadastrData(data)
          setLoading(false)
          setEnterText('')
          setLoader({})
          setDadata('')
        }

        else if (data.length === 1) {
          const cadNumber = data?.[0]?.cadnum
          setCadastrNumber(cadNumber)
          setLoading(false)
          setEnterText('')
          setLoader({})
          setDadata('')
        }

        else if (data.length === 0) {
          setCadastrData([])
          setLoading(false)
          setCheck(false)
          setEnterText('')
          setLoader({})
          setDadata('')
        }
        else {
          setCheck(true)
        }
      })
      .catch((e) => {
        setLoading(false)
        setError(true)
        setCadastrNumber('')
        setBaloonData('')
        setDadata('')
      })
    }
  }


  // const askPkk = async (target) => {
  //  await axios(`https://pkk.rosreestr.ru/api/typeahead/1?text=${target}&_=1688717719333`)
  //  .then(({ data }) => {
  //     setValue(() => data.results)
  //     return
  //  })
  //   .catch(() => {
  //     setLoading(false)
  //     setError(true)
  //     return
  //   })
  // }

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
  const askDadata = async (subject = '') => {
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token, //evgenzolotoff
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: {query: subject, 'count':10}
    })
    const regexp = /^\d{2}:\d{2}:\d{6,7}:\d+$/g
    const checker = regexp.test(subject)

    if (!checker) {
      setValue(() => getAskDadata.data.suggestions)
    }
    else {
      setValue('')
    }
  }


  const onChange = (e) => {
    setBaloonData('')
    setCadastrNumber('')
    setAlarmMessage(false)
    setCadastrData([])
    setEnterText(() => e.target.value)
    askDadata(e.target.value)
  }

  const clearToolTips = () => {
    if (!check) {
      setValue([])
      setEnterText('')
      setCadastrData([])
      setCheck(true)
      setError(false)
      setValidInput(false)
      setDadata('')
    } else {
      setValue([])
      setCadastrData([])
      setCheck(true)
      setError(false)
      setValidInput(false)

    }
  }

  const clearEnterText = () => {
    setEnterText('')
    setDadata('')
  }

  useEffect(() => {
    document.addEventListener('click', clearToolTips)
    return () => document.removeEventListener('click', clearToolTips)
  }, [])

  useEffect(() => {
      setLoader({})
  }, [closeChecker])

  useEffect(() => {
    if (referer) {
      sendDataToServer(referer)
    }
  }, [referer])

  useEffect(() => {
    if (!validInput && enterText.length < 5) {
      setValidForm(false)
    } else {
      setValidForm(true)
    }
  }, [validInput, enterText])


  return (
    <>
      <div className={style.tab}>
        <div className={style.tabs}>
          <div className={style.stepform_start} id="FormStep1">
            <form id={style.request_form}>
              <div className={`${style.section} ${style["tab-cont"]} ${style.active}`}>
              <div className={`${style["form-row"]}`}>
              {/* <div className={style.delay}>
                  Идут технические работы, возможны проблемы с поиском.
                </div> */}
              <div className={style.search__title}><span>Для поиска</span> введите адрес или кадастровый номер объекта:</div>
                <div className={`${style.colm} ${style.colm1}`}>
                    <input
                      type="text"
                      className={style.field_text}
                      placeholder="Введите кадастровый номер или выберите адрес из предложенных подсказок"
                      value={enterText}
                      onChange={onChange}
                    />
                      {loading ? (
                      <div className={style.pulseLoader4}>
                        <PulseLoader color="#AFB6BE" size={10} />
                      </div>
                    ) : ('')}
                      <div aria-hidden="true" className={style.searchIcon}>
                        {value.length === 0 ? (
                          <div></div>
                        ) : (
                          <CloseIcon
                            onClick={() => {
                              setDadata('')
                              clearEnterText()
                              setValidInput(false)
                            }}
                          />
                        )}
                      </div>
                  </div>

                  {value.length !== 0 && (
                    <div className={style.dataResult}>
                      {value.slice(0, 5).map((it, index) => {
                        const uniqueKey = +new Date()
                        return (
                          <>
                            <div
                              className={style.dataItem}
                              aria-hidden="true"
                              onClick={() => {
                                setEnterText(it?.value)
                                setValidInput(true)
                                setDadata(it?.data)
                              }}
                              key={`${index + uniqueKey}`}
                            >
                              <p className={style.adress}>{it?.value}</p>
                            </div>
                          </>
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className={style.search__example}>Пример:
                  <span
                    aria-hidden="true"
                    // onClick={() => {
                    //   setValidInput(true)
                    //   setEnterText('улица Приозёрная, земельный участок 10А')
                    // }}
                  > улица Приозёрная, земельный участок 10А
                  </span>  или
                  <span
                    aria-hidden="true"
                    onClick={() => {
                      setDadata('')
                      setValidInput(true)
                      setEnterText('77:01:0004022:2583')
                    }}
                  >  77:01:0004022:2583
                  </span>
                </div>
              </div>
              <div className={style.formData}>
                  <div className={style.formDataText}>
                    <p>
                      Произведите поиск по кадастровому номеру или адресу, либо кликните по интересующему объекту.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={style["form-submit1"]}
                    disabled={!validForm}
                    autoComplete="off"
                    onClick={() => {
                      setLoading(true)
                      sendDataToServer(enterText)

                    }}
                  >
                    <p className={style.next}>Поиск</p>
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {cadastrData && cadastrData?.length !== 0 && (
        <div className={style.stepform1}>
          <div className={style.searchObjects}>Выберите объект недвижимости для заказа отчета:</div>
          {/* <div className={style.searchObjects}>Найдено объектов {cadastrData?.length}шт.</div>
          <div className={`${style["table-row"]} ${style["t-header"]}`}>Выберите объект недвижимости для заказа отчета</div> */}
          {cadastrData.map((it, index) => {
            const uniqueKey = +new Date()
            // const cadNum = it?.properties?.options?.cad_num || it?.properties?.options?.cad_number || it?.attrs?.cn  под НСПД
            const cadNum = it?.cadnum
            return (
              <>
                {cadNum && <div
                    className={style.tab}
                    aria-hidden="true"
                    key={`${index + uniqueKey}`}
                  >
                    <div className={`${style["form-submit"]} ${style.table} ${style["step-1"]}`}>
                      <div className={style.faq1__cont}>
                        <div className={style.faq__title}>
                          <ul>
                            {(it.type === 'PARCEL' || it?.properties?.options?.land_record_type) ? <li className={style.type}>Земельный участок</li> : (
                                it.type === 'OKS' ? <li className={style.type}>Здание</li> : (
                                  it.type === "FLAT" ? <li className={style.type}>Квартира</li> : (
                                    it?.properties?.options?.type ? <li className={style.type}>{it?.properties?.options?.type}</li> : <li className={style.type}>Объект</li>
                                  )
                                )
                              )}
                            <li className={style.adr}>{it?.full_name}</li>
                            <li className={style.cad_n}>{it?.cadnum}</li>
                            <li className={style.choose}>
                              <p className={style.go}
                              onClick={() => {
                                setLoader({ ...loader, [index]: true })
                                // sendDataToServer(it?.properties?.options?.cad_num || it?.properties?.options?.cad_number || it?.attrs?.cn)
                                sendDataToServer(it?.cadnum)
                                setType(it?.type)
                              }}
                              >
                              {loader[index] ? (
                                <div className={style.pulseLoader3}>
                                  <PulseLoader color="#AFB6BE" size={10} />
                                </div>
                              ) : ('Выбрать')}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>}
              </>
            )
          })}
        </div>
      )}
      {error && (
        <div className={style.dataResult1}>
          <div className={style.dataError}>
            В настоящее время сервер не доступен. Попробуйте произвести поиск чуть позже, либо найдите объект с помощью карты.
          </div>
        </div>
      )}
      {cadastrData && cadastrData.length === 0  && !check && (
        <div className={style.dataResult1}>
          <div className={style.dataError}>
            По данному адресу в базе Росреестра не найдено ни одного объекта.
          </div>
        </div>
      )}
    </>
  )
}
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import FastCadastrData from './fastCadastrData';
import PulseLoader from "react-spinners/PulseLoader";
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
// import tokenChange from '@/Components/files/tokenChanger'
import  { useSession } from 'next-auth/react'
import style from '../styles/File.module.css'

export const Search = ({ cadastrData , setCadastrData }) => {
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


  const { data: session } = useSession()
  const [token, setToken] = useState('Token 431c3958f002f6f546afe128257059d372093aa2')
  const router = useRouter()
  const [error, setError] = useState(false)
  const [tooltipsError, setTooltipsError] = useState(false)
  const [value, setValue] = useState('')
  const [dadata, setDadata] = useState('')
  const [enterText, setEnterText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState({})
  // const [cadastrData, setCadastrData] = useState([])
  const [check, setCheck] = useState(true)
  const [validForm, setValidForm] = useState(false)
  const [validInput, setValidInput] = useState(false)
  const [turn, setTurn] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1) // Индекс выбранного адреса

  const ref = useRef(null)

  const region = dadata?.region_with_type
  const city = dadata?.city || null
  const settlement = dadata?.settlement || null
  const street = dadata?.street || null
  const house = dadata?.house || null
  const flat = dadata?.flat || null

  let fullAddress = `${region}|${city}|${settlement}|${street}|${house}|${flat}`

  if (enterText === 'г Ульяновск, Сиреневый проезд, д 6, кв 49') {
    fullAddress = 'г Ульяновск, Сиреневый проезд, д 6, кв 49'
  }

  function handleChange (event) {
    let {checked} = event.target
    if (checked) {
      setTurn(true)
    } else {
      setTurn(false)
    }
  }

  const sendDataToServer = async (fullAddress, number) => {
    const formattedInput = number.replace(/\s/g, '')
    const regexp = /^\d{2}:\d{2}:\d{6,7}:\d+$/g
    const checker = regexp.test(formattedInput)

    if (checker) {
      router.push(`/kadastr/${formattedInput}`)
    }

    else {
      await axios.get(`/api/tooltips?text=${fullAddress}`)
      .then(async ({ data }) => {

        if (!data) {
          setError(true)
          setLoading(false)
          setEnterText('')
        }
        if (data?.[0]?.cadnum === '34:34:000000:1288') {
          setCadastrData([])
          setLoading(false)
          setCheck(false)
          setEnterText('')
        }

        else if (data.length !== 0 && data !=='error') {
          setCadastrData(data)
          setLoading(false)
          setEnterText('')
        }

        else if (data === 'error') {
          const findByAddress = await axios({
            method: 'POST',
            url: '/api/findByAddress',
            data: dadata
          })
          if (findByAddress.data.length === 0) {
            setTooltipsError(true)
            setLoading(false)
            setEnterText('')
          }
          setCadastrData(findByAddress.data)
          setLoading(false)
          setEnterText('')
        }

        else if (data.length === 0) {
          setCadastrData(data)
          setLoading(false)
          setCheck(false)
          setEnterText('')
        }
        else {
          setCheck(true)
        }
      })
    }
  }


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
    setCadastrData('')
    setEnterText(() => e.target.value)
    askDadata(e.target.value)
  }

  const clearToolTips = () => {
    if (!check) {
      setValue([])
      setEnterText('')
      setCheck(true)
      setError(false)
      setValidInput(false)
      setTooltipsError(false)

    } else {
      setValue([])
      setCheck(true)
      setError(false)
      setValidInput(false)
      setTooltipsError(false)
    }
  }

  const clearEnterText = () => {
    setEnterText('')
  }

  useEffect(() => {
    document.addEventListener('click', clearToolTips)
    return () => document.removeEventListener('click', clearToolTips)
  }, [])

  useEffect(() => {
    if (!validInput && enterText.length < 5) {
      setValidForm(false)
    } else {
      setValidForm(true)
    }
  }, [validInput, enterText])

  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        setLoading(true)
        sendDataToServer(enterText, enterText)
        setValue('')
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [enterText]);

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

  const focus = () => {
    ref?.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    setTimeout(() => {
      focus()
    }, 50)
  }, [cadastrData])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          Math.min(prevIndex + 1, value.length - 1)
        );
      } else if (e.key === 'Enter' && selectedIndex !== -1) {
        e.preventDefault();
        const selectedAddress = value[selectedIndex];
        setEnterText(selectedAddress?.value);
        setDadata(selectedAddress?.data);
        setValidInput(true);
        setValue('')
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, value, setEnterText, setDadata, setValidInput]);

  return (
    <>
    <div className={style.tab} id="t1">
      <div className={style.tabs}>
        <div className={style.stepform_start}>
          <form id={style.request_form}>
            <div className={`${style.section} ${style["tab-cont"]} ${style.active}`}>
              <div className={`${style["form-row"]}`}>
              {session ?<input type="checkbox" className={`${style["checkbox-list"]}`}  onChange={handleChange} /> : ''}
              {turn ?
                <div className={style.delay}>
                  Возможны проблемы с поиском по адресу. Временно рекомендуем искать объекты по кадастровому номеру.
                </div>
                :
                ''
              }
              {/* <a className={style.mkdReestr} href="https://домофонд.su" title="федеральный реестр многоквартирных домов"><div>Реестр многоквартирных домов</div></a> */}
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
                      <PulseLoader color="#48a728" size={10} />
                    </div>
                  ) : ('')}
                    <div aria-hidden="true" className={style.searchIcon}>
                      {value.length === 0 ? (
                        <div></div>
                      ) : (
                        <CloseIcon
                          onClick={() => {
                            clearEnterText()
                          }}
                        />
                      )}
                    </div>
                </div>

                {value.length !== 0 && (
                  <div className={style.dataResult}>
                    {value.slice(0, 5).map((it, index) => {
                      const uniqueKey = +new Date()
                      const isSelected = index === selectedIndex;
                      return (
                        <>
                          <div
                            className={`${style.dataItem} ${isSelected ? `${style.selected}` : ''}`}
                            aria-hidden="true"
                            onClick={() => {
                              setEnterText(it?.value),
                              setDadata(it?.data)
                              setValidInput(true)
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
               <div className={style.search__example}>Пример:
                  <span
                    aria-hidden="true"
                    onClick={() => {
                      setEnterText('г Ульяновск, Сиреневый проезд, д 6, кв 49')
                      setValidInput(true)
                    }}
                  > Ульяновск, Сиреневый проезд, д 6, кв 49
                  </span>  или
                  <span
                    aria-hidden="true"
                    onClick={() => {
                      setEnterText('61:02:0070202:1824')
                      setValidInput(true)
                    }}
                  >  61:02:0070202:1824
                  </span>
                </div>
              </div>
            </div>
            <div className={style.formData}>
              <div className={style.formDataText}>
                <p>
                  Единая онлайн форма поиска недвижимости для заказа отчетов. Произведите поиск по кадастровому номеру или адресу.
                  {/* Сбор сведений для проведения комплексной проверки объекта недвижимости и собственника производится из официальных источников: Росреестр, ЕГРН, ЕРЗН, ФАС, ФССП, ФНП. */}
                </p>
              </div>
              <button
                type="button"
                className={`${style["form-submit1"]}`}
                disabled={!validForm}
                autoComplete="off"
                onClick={() => {
                  setLoading(true)
                  sendDataToServer(fullAddress, enterText)

                }}
              >
                <p className={style.next}>Поиск</p>
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
    {cadastrData.length > 1 && (
        <div className={style.stepform1}>
          <div className={style.searchObjects} ref={ref}>Найдено объектов: {cadastrData.length}шт.</div>
          <div className={`${style["table-row"]} ${style["t-header"]}`}>Выберите объект недвижимости для заказа отчета</div>
          {cadastrData.map((it, index) => {
            const uniqueKey = +new Date()
            return (
              <>
                <div
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
                            {/* <li className="type">Адрес объекта</li> */}
                            <li className={style.adr}>{it?.full_name || it?.addressNotes || it?.properties?.options?.readable_address}</li>
                            <li className={style.cad_n}>{it?.cadnum || it?.objectCn || it?.properties?.options?.cad_number || it?.properties?.options?.cad_num}</li>
                            <li className={style.choose}>
                              <p className={style.go}
                              onClick={() => {
                                setLoader({ ...loader, [index]: true })
                                // setType(it?.type)
                                // loadReesrt(enterText)
                                sendDataToServer(fullAddress, it.cadnum || it?.objectCn || it?.properties?.options?.cad_number || it?.properties?.options?.cad_num)
                                setValidInput(true)
                              }}
                              >
                              {loader[index] ? (
                                <div className={style.pulseLoader3}>
                                  <PulseLoader color="#48a728" size={10} />
                                </div>
                              ) : ('Выбрать')}
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
              </>
            )
          })}
        </div>
      )}
      {error && (
        <div className={style.dataResult1}>
          <div className={style.dataError}>
            В настоящее время сервер не доступен. Попробуйте произвести поиск чуть позже.
          </div>
        </div>
      )}
      {tooltipsError && (
        <div className={style.dataResult1}>
          <p className={style.dataError}>
            Объект не найден, или адрес указан некорректно. Попробуйте произвести поиск еще раз, либо используйте для поиска кадастровый номер, например
            <span
              aria-hidden="true"
              className={style.errorExample}
              onClick={() => {
                setEnterText('61:02:0070202:1824')
                setValidInput(true)
              }}
            >  61:02:0070202:1824
            </span>
          </p>
        </div>
      )}
      {cadastrData.length === 1 && (
        <FastCadastrData cadastrData={cadastrData}/>
      )}
      {cadastrData.length === 0  && !check && (
        <div className={style.dataResult1}>
          <div className={style.dataError}>
            В базах росреестра ничего не найдено. Возможно вы ввели не верный кадастровый номер, либо не выбрали адрес из предложенных подсказок.
          </div>
        </div>
      )}
    </>
  )
}

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import PulseLoader from "react-spinners/PulseLoader";
import CloseIcon from '@material-ui/icons/Close'
// import  { useSession } from 'next-auth/react'
import style from '../styles/File.module.css'

export const SearchEgul = () => {
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
   ]

  const router = useRouter()
  // const { data: session } = useSession()
  const [token, setToken] = useState('Token 431c3958f002f6f546afe128257059d372093aa2')
  const [value, setValue] = useState('')
  const [dadata, setDadata] = useState('')
  const [enterText, setEnterText] = useState('')
  const [loading, setLoading] = useState(false)
  const [check, setCheck] = useState(true)
  const [validForm, setValidForm] = useState(false)
  const [validInput, setValidInput] = useState(false)



  const sendDataToServer = async (inn, name) => {
    if (name === 'ООО "СОНАТА"') {
      router.push(`/company/6340007188`)

    } else {
      router.push(`/company/${inn || name}`)
    }
  }

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
  const askDadata = async (subject = '') => {
    const getAskDadata = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token,
        'Host': 'suggestions.dadata.ru',
      },
      url: encodeURI(url),
      data: {query: subject, 'count':10}
    })
    setValue(() => getAskDadata.data.suggestions)
  }

  const onChange = (e) => {
    setEnterText(() => e.target.value)
    askDadata(e.target.value)

  }

  const clearToolTips = () => {
    if (!check) {
      setValue([])
      setEnterText('')
      setCheck(true)
      setValidInput(false)
    } else {
      setValue([])
      setCheck(true)
      setValidInput(false)
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

  return (
    <>
      <div className={style.tab} id="t1">
        <div className={style.tabs}>
          <div className={style.stepform_start}>
            <form id={style.request_form}>
            <div className={`${style.section} ${style["tab-cont"]} ${style.active}`}>
              <div className={`${style["form-row"]}`}>
                  <div className={style.search__title}>
                    <span>Для поиска</span> введите название компании или ИНН
                  </div>
                  <div className={`${style.colm} ${style.colm1}`}>
                    <input
                      type="text"
                      className={style.field_text}
                      placeholder="ООО СОНАТА или 6340007188"
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
                            clearEnterText()
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {value.length !== 0 && (
                    <div className={style.dataResult}>
                      {value.map((it, index) => {
                        const uniqueKey = +new Date()
                        return (
                          <div
                            className={style.dataItem1}
                            aria-hidden="true"
                            onClick={() => {
                              setEnterText(it?.value),
                              setDadata(it?.data?.inn)
                              setValidInput(true)
                            }}
                            key={`${index + uniqueKey}`}
                          >
                            <div className={style.mainDataItemInfo}>
                              <ul>
                                <li className={style.organizationName}>{it?.value}</li>
                                <li className={style.adress}>{it?.data?.address?.data?.city}</li>
                                {it?.data?.state?.status === 'ACTIVE' ? (
                                  <li className={style.typeGood}>Дествующая</li>
                                ) : (
                                  <li className={style.typeBad}>Ликвидировано</li>
                                )}
                              </ul>
                            </div>
                            <div className={style.secondDataItemInfo}>
                              <ul>
                                <li className={style.smallData}>{`ИНН ${it?.data?.inn}`}</li>
                                <li className={style.smallData}>{`ОГРН ${it?.data?.ogrn}`}</li>
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className={style.search__example}>Пример:
                    <span
                      aria-hidden="true"
                      onClick={() => {
                        setEnterText('ООО "СОНАТА"')
                        setValidInput(true)
                      }}
                    >
                      ООО СОНАТА
                    </span>  или
                    <span
                      aria-hidden="true"
                        onClick={() => {
                        setEnterText('6340007188')
                        setValidInput(true)
                      }}
                    >
                      6340007188
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.formData}>
                <div className={style.formDataText}>
                  <p>
                    Единая онлайн форма поиска юридических лиц в ЕГРЮЛ. Произведите поиск по названию компании или ИНН.
                  </p>
                </div>
                <button
                  type="button"
                  className={`${style["form-submit1"]}`}
                  disabled={!validForm}
                  autoComplete="off"
                  onClick={() => {
                    setLoading(true)
                    sendDataToServer(dadata, enterText)
                  }}
                >
                  <p className={style.next}>Поиск</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>

  )
}

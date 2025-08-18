import { MongoClient } from 'mongodb'
import { mailer } from '@/config/nodemailer'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function addOrder(req, res) {
  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('goscadastrOrders')
  const fullOrder = req.body
  const orderNumber = fullOrder?.orderNumber
  const cadastrNumber = fullOrder?.cadastrNumber
  const summa = fullOrder?.summa
  const email = fullOrder?.email
  const kindOfRaports = fullOrder?.kindOfRaports

  const outputObject = () => {
    return kindOfRaports.map((it, index) => {
      return <li key={index}>{`${cadastrNumber} - ${it}`}</li>
    })
  }

  const message = {
    from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
    to: email,
    subject: `Заявка №${orderNumber} на сайте cadmap.su`,
    html: `
    <body class="pc-fb-font" bgcolor="#e5e5e5" style="background-color: #e5e5e5; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100% !important; Margin: 0 !important; padding: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%">
      <table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%" border="0" cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td style="padding: 0; vertical-align: top;" align="center" valign="top">
              <table class="pc-container" align="center" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; Margin: 0 auto; max-width: 620px;" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr>
                    <td align="left" style="vertical-align: top; padding: 0 10px;" valign="top">
                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;" valign="top">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; background-color: #2d3c5f ; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)" valign="top" bgcolor="#2d3c5f ">
                              <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td class="pc-menu-logo-s2" align="center" style="vertical-align: top; padding: 30px 40px 31px;" valign="top">
                                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 130px;" width="40">
                                        <tbody>
                                          <tr>
                                            <td style="vertical-align: top;" valign="top"> <a href="https://cadmap.su" style="text-decoration: none;">
                                            <img src="https://cadmap.su/images/bigLogo.jpg" width="186" height="47" alt="" style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; display: block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 500; color: #ffffff;">
                                        </a> </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="vertical-align: top; height: 1px; font-size: 1px; line-height: 1px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" valign="top" bgcolor="#4B4B4B">&nbsp;</td>
                                  </tr>

                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellspacing="0" cellpadding="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;" valign="top">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td class="pc-cta-box-s4" style="vertical-align: top; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)" valign="top" bgcolor="#ffffff">
                              <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td class="pc-cta-box-in" style="vertical-align: top; padding: 42px 40px 35px;" valign="top">
                                      <table class="pc-cta-s1" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                        <tbody>
                                          <tr>
                                            <td class="pc-cta-title pc-fb-font" style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; line-height: 1.28; /*! letter-spacing: -0.6px; */ color: #151515; text-align: justify;" valign="top" align="center">Ваш заказ №${orderNumber}  </td>
                                          </tr>
                                          <tr>
                                            <td style="vertical-align: top; height: 70px; line-height: 70px; font-size: 70px;" valign="top">&nbsp;</td>
                                          </tr>

                                          <tr>
                                            <td class="pc-cta-text pc-fb-font" style="/*! vertical-align: top; */ font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 300; line-height: 1.56; color: #9B9B9B; text-align: justify;/*! display: flex; */" valign="top" align="center">Здравствуйте. Вы  сформировали заявку №${orderNumber}. Остался один шаг — оплата.
                                              <br>
                                              <br>
                                              В работу поступят следующие услуги:
                                              <ul>
                                                ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
                                              </ul>
                                              После оплаты ${summa} руб. заказ поступит в работу, а отчёт, по готовности будет отправлен вам на email ${email}.
                                              <br>
                                              <br>
                                              Напоминаем, что отчеты необходимы:
                                              <br>
                                                <ul>
                                                <li>Для проверки регистрации прав собственности;</li>
                                                <li>Для проверки обременений, залогов, арестов;</li>
                                                <li>Для совершения любых сделок с недвижимостью;</li>
                                                <li>Для составления завещания или брачного контракта, заключения договора дарения;</li>
                                                <li>По требованию в любые госучреждения, в том числе, в налоговые и судебные органы;</li>
                                                </ul>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="vertical-align: top; height: 25px; line-height: 25px; font-size: 25px;" valign="top">&nbsp;</td>
                                          </tr>
                                          <tr>
                                            <td style="vertical-align: top; padding: 5px 0;" valign="top" align="center">
                                              <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                <tbody>
                                                  <tr>
                                                    <td style="vertical-align: top; border-radius: 8px; text-align: center; background-color: #2d3c5f;" valign="top" bgcolor="#1595E7" align="center"> <a href=${`https://cadmap.su/discount/${orderNumber}|${summa}`} style="line-height: 1.5; text-decoration: none; margin: 0; padding: 13px 17px; white-space: nowrap; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; background-color: #1595E7; color: #ffffff; border: 1px solid #1595E7;">Перейти к оплате</a></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellspacing="0" cellpadding="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;" valign="top">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellspacing="0" cellpadding="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;" valign="top">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td class="pc-footer-box-s1" style="vertical-align: top; padding: 21px 20px 14px; background-color: #2d3c5f ; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)" valign="top" bgcolor="#2d3c5f ">
                              <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                <tbody>
                                  <tr>
                                    <td class="pc-footer-row-s1" style="vertical-align: top; font-size: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;" valign="top">
                                      <div class="pc-footer-row-col" style="display: inline-block; width: 100%; /*! max-width: 280px; */ vertical-align: top;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                          <tbody>
                                            <tr>
                                              <td style="vertical-align: top; padding: 20px;" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" class="pc-footer-text-s1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                                  <tbody>
                                                    <tr>
                                                      <td class="pc-fb-font" style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: #ffffff;" valign="top">Служба поддержки:</td>
                                                    </tr>
                                                    <tr>
                                                      <td class="pc-fb-font" style="vertical-align: top; padding: 11px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;" valign="top"> <a style="text-decoration: none; cursor: text; color: #D8D8D8;">cadmap.su</a> </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                                <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                                  <tbody>
                                                    <tr>
                                                      <td class="pc-fb-font" style="vertical-align: top; padding: 9px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; line-height: 1.7;" valign="top"> <a href="mailto:bo.grady@nathen.biz" style="text-decoration: none; color: #1595E7;">admin@cadmap.su</a> </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                        <tbody>
                          <tr>
                            <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;" valign="top">&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>`
  }

  await mailer(message)
  console.log('отправили письмо с ссылкой на оплату')
  await collection.updateOne({orderNumber: orderNumber}, { $set: {mailSend: true}})
  return res.json('отправили письмо с ссылкой на оплату')
}
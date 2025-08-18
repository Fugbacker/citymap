import { MongoClient } from 'mongodb'
import { mailer } from '../../config/nodemailer'
import axios from "axios";
import UserAgent from 'user-agents';
import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import pdf from 'html-pdf';
import CadastrCostPdfGenerator from "@/Components/cadastrCostPdfGenerator";
import https from 'https';
import { getGeoportalUrls } from '@/libs/urls';

const userAgent = new UserAgent()
const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function result(req, res) {
  const resultData = req.body
  const order = resultData?.object?.description
  const incomeSumma = resultData?.object?.income_amount?.value
  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('goscadastrOrders')
  await collection.updateOne({orderNumber: order}, { $set: {status: 'payed'}})
  const orderData = await collection.findOne({orderNumber: order})
  const address = orderData?.address
  const clientEmail = orderData?.email
  const numberOfOrder = orderData?.orderNumber
  const cadNumber = orderData?.cadastrNumber
  const summa = orderData?.summa
  const link = orderData?.link
  const arrayOfRaports = orderData?.kindOfRaports
  const reestrChecker = orderData?.reestrChecker
  const data = new Date()
  const year = data.getFullYear()
  const month = `0${data.getMonth()+1}`
  const monthReal = month.length > 2 ? month.slice(1) : month
  const day = data.getDate()
  const hour = data.getHours()
  const minutes = data.getMinutes()


  const outputObject = () => {
    if (!reestrChecker) {
      return arrayOfRaports.map((it, index) => {
        return <li key={index}>{`${cadNumber} - ${it}`}</li>
      })
    } else {
      return arrayOfRaports.map((it, i) => {
        return <li key={i}>{`${it} - ${address}`}</li>
      })
    }
  }

  // Если 'Экспресс отчет' есть в массиве

  if (arrayOfRaports.includes('Экспресс отчет') && !arrayOfRaports.includes('Справка о кадастровой стоимости')) {
    try {
      console.log('ЭКСПРЕСС ОТЧЕТ');
      const message = {
        from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
        to: clientEmail,
        subject: `Вы оплатили заказ №${numberOfOrder} на сайте cadmap.su`,
        html: `
          <p>Здравствуйте. Мы получили оплату и уже работаем над вашим заказом №${numberOfOrder}.</p>
          <p><b>В работе следующие услуги:</b></p>
          <ul>
            ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
          </ul>
          <p>Заказ будет отправлен на указанный почтовый ящик сразу же после исполнения.</p>
          <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>`
      };
      console.log('ОТПРАВИЛИ ОБЩЕЕ ПИСЬМО КЛИЕНТУ');
      await mailer(message);

      const modifiedString = cadNumber.replace(/:/g, '-');
      const websiteUrl = `https://cadmap.su/justifycontentcenter/${cadNumber}`;
      console.log('websiteUrl', websiteUrl)
      const response = await axios.get(websiteUrl);
      const $ = cheerio.load(response.data);
      const htmlContent = $('div.first').html();
      const htmlWithImage = `
        <html>
          <head>
            <title>PDF с изображением</title>
            <style>
              body {
                zoom: 0.5; /* Уменьшаем масштаб до 75%, чтобы контент помещался на A4 */
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;
      const pdfFilePath = path.join(`./public/expressPdf/${modifiedString}.pdf`);

      pdf.create(htmlWithImage, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null'
          }
        },
        format: "A4",
        border: {
          top: '25px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      }).toFile(pdfFilePath, async (err, filePath) => {
        if (err) {
          console.log('ОШИБКА ПРИ СОЗДАНИИ PDF', err);
          res.status(500).json({ error: 'Ошибка при создании PDF' });
          return;
        }

        const fileStream = fs.createReadStream(filePath.filename);
        const stat = fs.statSync(filePath.filename);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=example.pdf`);
        fileStream.pipe(res);

        const messageWithExpressReport = {
          from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
          to: clientEmail,
          subject: `Экспресс-отчет`,
          html: `
            <p>Здравствуйте, ранее вы оплатили кадастровые отчеты, ваш экспресс отчет во вложении.</p>
            <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>

            <p>Дополнительная информация:</p>
            <p>Наш телеграмм бот для заказа отчетов:  https://t.me/goskadastrBot</p>
            <p>Предлагаем  дистанционное  выполнение  кадастровых  работ  по выгодным
            ценам, а именно:</p>
              <ul>
                <li>Ситуационный план (для подачи в горэлектросети).</li>
                <li>СПОЗУ - Схема планировочной организации земельного участка выполняются на основе разрешения на строительство.</li>
                <li>Решение собственников о разделе.</li>
                <li>Раздел земельного участка на несколько участков (с подачей/без подачи межевого плана).</li>
                <li>Объединение нескольких участков в один (с подачей/без подачи межевого плана).</li>
                <li>Другие кадастровые работы.</li>
              </ul>
              <p>За подробной информацией обращайтесь в ответном письме.</p>
            `,
          attachments: [{ path: pdfFilePath }]
        };

        await mailer(messageWithExpressReport);
        console.log('ОТПРАВИЛИ ЭКСПРЕСС ОТЧЕТ КЛИЕНТУ');

        const adminMessage = {
          from: clientEmail,
          to: 'admin@cadmap.su',
          subject: `${cadNumber} - Уведомление о новом платеже`,
          html:`
            <p>Поступил новый заказ</p>
            <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
            <p><b>Заказанные услуги:</b></p>
            ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
            <p>Номер заказа: <b>${numberOfOrder}</b></p>
            <p>Сумма заказа: <b>${summa}</b></p>
            <p>Сумма дохода: <b>${incomeSumma}</b></p>
          `,
          attachments: [{ path: pdfFilePath }]
        };

        await mailer(adminMessage);
        console.log('ОТПРАВИЛИ ПИСЬМО АДМИНУ');

        setTimeout(() => {
          fs.unlink(pdfFilePath, (err) => {
            if (err) {
              console.error('Ошибка при удалении файла:', err);
              return;
            }
            console.log('Файл успешно удален:', pdfFilePath);
          });
        }, 30000);
        console.log('УДАЛИЛИ ОТЧЕТЫ НА СЕРВЕРЕ');
      });

    } catch {
      const adminMessage = {
        from: clientEmail,
        to: 'admin@cadmap.su',
        subject: `${cadNumber} - Уведомление о новом заказе с ошибкой `,
        html:`
          <p>Поступил новый заказ, но при создании отчета произошла ошибка и отчет не был отправлен</p>
          <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
          <p><b>Заказанные услуги:</b></p>
          ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
          <p>Номер заказа: <b>${numberOfOrder}</b></p>
          <p>Сумма заказа: <b>${summa}</b></p>
          <p>Сумма дохода: <b>${incomeSumma}</b></p>
        `
      };

      await mailer(adminMessage);
      console.log('ОТПРАВИЛИ ПИСЬМО АДМИНУ ОБ ОШИБКЕ');
    }

   }

  else if (!arrayOfRaports.includes('Экспресс отчет') && arrayOfRaports.includes('Справка о кадастровой стоимости')) {
    try {
      console.log('КАДАСТРОВАЯ СПРАВКА');
      const message = {
        from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
        to: clientEmail,
        subject: `Вы оплатили заказ №${numberOfOrder} на сайте cadmap.su`,
        html: `
          <p>Здравствуйте. Мы получили оплату и уже работаем над вашим заказом №${numberOfOrder}.</p>
          <p><b>В работе следующие услуги:</b></p>
          <ul>
            ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
          </ul>
          <p>Заказ будет отправлен на указанный почтовый ящик сразу же после исполнения.</p>
          <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>`
      };
      console.log('ОТПРАВИЛИ ОБЩЕЕ ПИСЬМО КЛИЕНТУ');
      await mailer(message);

      const modifiedString = cadNumber.replace(/:/g, '-');


      const fetchData1 = async (url) => {
        try {
          const httpsAgent = new https.Agent({
            rejectUnauthorized: false, // НЕБЕЗОПАСНО, но если нужен самоподписанный сертификат — оставить
            keepAlive: true, // Сохраняем соединение дольше
          });

          const { data } = await axios.get(url, {
            httpsAgent,
            timeout: 2000,
            headers: {
              'User-Agent': userAgent.toString(),
            },
          });

          return data;
        } catch (e) {
          return null;
        }
      };

      const geoportalUrls = getGeoportalUrls(cadNumber);

      const shuffledUrls = [...geoportalUrls];
      for (let i = geoportalUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledUrls[i], shuffledUrls[j]] = [shuffledUrls[j], shuffledUrls[i]];
      }

      let object = null;

      for (const url of shuffledUrls) {
        console.log('Делаем поиск по URL:', url);
        object = await fetchData1(url);
        if (object) break;
      }

      let historyCadPrice

      // try {
      //   const url = `https://nspd.gov.ru/api/data-fund/v2/cadastral-history-diagram?cadNumber=${cadNumber}`
      //   let nspdData = await axios({
      //     headers: {
      //       'Access-Control-Allow-Origin': '*',
      //       'Host': 'nspd.gov.ru',
      //       'Priority': 'u=1',
      //       'Connection': 'keep-alive',
      //       'Referer': 'https://nspd.gov.ru/map',
      //       'rejectUnauthorized': false,
      //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
      //     },
      //     method: 'GET',
      //     timeout: 1000 * 6,
      //     url: url
      //   })

      //   historyCadPrice = nspdData?.data?.data

      // } catch {
      //   historyCadPrice = []
      // }

      try {
        const url = `	https://gcadastr.su/api/hystory?cadNum=${cadNum}`
        let nspdData = await axios({
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Host': 'nspd.gov.ru',
            'Priority': 'u=1',
            'Connection': 'keep-alive',
            'Referer': 'https://nspd.gov.ru/map',
            'rejectUnauthorized': false,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
          },
          method: 'GET',
          timeout: 1000 * 6,
          url: url
        })

        historyCadPrice = nspdData?.data

      } catch {
        historyCadPrice =[]
      }


      if (historyCadPrice.length !== 0) {
        object = {
          ...object,
          historyCadPrice
        }
      }

      // const object = await collection.findOne({objectId: processCadastralNumber(cadastrNumber)})
      const cadCostHtml = CadastrCostPdfGenerator({object})

      const pdfFilePath = path.join(`./public/expressPdf/${modifiedString}.pdf`);

      pdf.create(cadCostHtml, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null'
          }
        },
        format: "A2",
        border: {
          top: '75px',
          right: '50px',
          bottom: '50px',
          left: '50px'
        }
      }).toFile(pdfFilePath, async (err, filePath) => {
        if (err) {
          console.log('ОШИБКА ПРИ СОЗДАНИИ PDF', err);
          res.status(500).json({ error: 'Ошибка при создании PDF' });
          return;
        }

        const fileStream = fs.createReadStream(filePath.filename);
        const stat = fs.statSync(filePath.filename);

        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=example.pdf`);
        fileStream.pipe(res);

        const messageWithExpressReport = {
          from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
          to: clientEmail,
          subject: `Справка о кадастровой стоимости`,
          html: `
            <p>Здравствуйте, ранее вы оплатили кадастровые отчеты, справка о кадастровой стоимости во вложении.</p>
            <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>
            <p>Дополнительная информация:</p>
            <p>Наш телеграмм бот для заказа отчетов:  https://t.me/goskadastrBot</p>
            <p>Предлагаем  дистанционное  выполнение  кадастровых  работ  по выгодным
            ценам, а именно:</p>
              <ul>
                <li>Ситуационный план (для подачи в горэлектросети).</li>
                <li>СПОЗУ - Схема планировочной организации земельного участка выполняются на основе разрешения на строительство.</li>
                <li>Решение собственников о разделе.</li>
                <li>Раздел земельного участка на несколько участков (с подачей/без подачи межевого плана).</li>
                <li>Объединение нескольких участков в один (с подачей/без подачи межевого плана).</li>
                <li>Другие кадастровые работы.</li>
              </ul>
              <p>За подробной информацией обращайтесь в ответном письме.</p>
            `,
          attachments: [{ path: pdfFilePath }]
        };

        await mailer(messageWithExpressReport);
        console.log('ОТПРАВИЛИ СПРАВКУ О КАДАСТРОВОЙ СТОИМОСТИ КЛИЕНТУ');

        const adminMessage = {
          from: clientEmail,
          to: 'admin@cadmap.su',
          subject: `${cadNumber} - Уведомление о новом платеже`,
          html:`
            <p>Поступил новый заказ</p>
            <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
            <p><b>Заказанные услуги:</b></p>
            ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
            <p>Номер заказа: <b>${numberOfOrder}</b></p>
            <p>Сумма заказа: <b>${summa}</b></p>
            <p>Сумма дохода: <b>${incomeSumma}</b></p>
          `,
          attachments: [{ path: pdfFilePath }]
        };

        await mailer(adminMessage);
        console.log('ОТПРАВИЛИ ПИСЬМО АДМИНУ');

        setTimeout(() => {
          fs.unlink(pdfFilePath, (err) => {
            if (err) {
              console.error('Ошибка при удалении файла:', err);
              return;
            }
            console.log('Файл успешно удален:', pdfFilePath);
          });
        }, 30000);
        console.log('УДАЛИЛИ ОТЧЕТЫ НА СЕРВЕРЕ');
      });
    } catch {
      const adminMessage = {
        from: clientEmail,
        to: 'admin@cadmap.su',
        subject: `${cadNumber} - Уведомление о новом заказе с ошибкой`,
        html:`
          <p>Поступил новый заказ, но при создании отчета произошла ошибка и отчет не был отправлен</p>
          <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
          <p><b>Заказанные услуги:</b></p>
          ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
          <p>Номер заказа: <b>${numberOfOrder}</b></p>
          <p>Сумма заказа: <b>${summa}</b></p>
          <p>Сумма дохода: <b>${incomeSumma}</b></p>
        `,
      };

      await mailer(adminMessage);
      console.log('ОТПРАВИЛИ ПИСЬМО АДМИНУ ОБ ОШИБКЕ');
    }
  }

  else if (arrayOfRaports.includes('Экспресс отчет') && arrayOfRaports.includes('Справка о кадастровой стоимости')) {
    try {
      console.log('ЭКСПРЕСС ОТЧЕТ И СПРАВКА О КАДАСТРОВОЙ СТОИМОСТИ')
      const message = {
      from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
      to: clientEmail,
      subject: `Вы оплатили заказ №${numberOfOrder} на сайте cadmap.su`,
      html: `
      <p>Здравствуйте. Мы получили оплату и уже работаем над вашим заказом №${numberOfOrder}.</p>
      <p><b>В работе следующие услуги:</b></p>
      <ul>
      ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
      </ul>
      <p>Заказ будет отправлен на указанный почтовый ящик сразу же после исполнения.</p>
      <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>`
    }
    console.log('ОТПРАВИЛИ ОБЩЕЕ ПИСЬМО КЛИЕНТУ')
    await mailer(message)

    const websiteUrl = `https://cadmap.su/justifycontentcenter/${cadNumber}`; // Замените на ваш URL
    const response = await axios.get(websiteUrl);
    const $ = cheerio.load(response.data);

    const htmlContent = $('div.first').html()

    const expressHtml = `
    <html>
      <head>
        <title>PDF с изображением</title>
      </head>
      <body>

        ${htmlContent}
      </body>
    </html>
  `;


  const fetchData1 = async (url) => {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // НЕБЕЗОПАСНО, но если нужен самоподписанный сертификат — оставить
        keepAlive: true, // Сохраняем соединение дольше
      });

      const { data } = await axios.get(url, {
        httpsAgent,
        timeout: 2000,
        headers: {
          'User-Agent': userAgent.toString(),
        },
      });

      return data;
    } catch (e) {
      return null;
    }
  };


  // let object = await fetchData1(`https://ns2.mapbaza.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNumber}`);

  // if (!object) {
  //   object = await fetchData1(`https://nspd.gov.ru/api/data-fund/v1/geom?kind=land&cadNumber=${cadNumber}`)
  // }

  // if (!object) {
  //   object = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/geoportal?query=${cadNumber}`);
  // }


  // if (!object) {
  //   object = await fetchData1(`https://nspd.gov.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNumber}`);
  // }

  // if (!object) {
  //   object = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/geoportal?query=${cadNumber}`);
  // }

  // if (!object) {
  //   object = await fetchData1(`https://ns2.mapbaza.ru/api/geoportal/v2/search/cadastralPrice?query=${cadNumber}`);
  // }

  const geoportalUrls = getGeoportalUrls(cadNumber);

  const shuffledUrls = [...geoportalUrls];
  for (let i = geoportalUrls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledUrls[i], shuffledUrls[j]] = [shuffledUrls[j], shuffledUrls[i]];
  }

  let object = null;

  for (const url of shuffledUrls) {
    console.log('Делаем поиск по URL:', url);
    object = await fetchData1(url);
    if (object) break;
  }

  let historyCadPrice

  // try {
  //   const url = `https://nspd.gov.ru/api/data-fund/v2/cadastral-history-diagram?cadNumber=${cadNumber}`
  //   let nspdData = await axios({
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Host': 'nspd.gov.ru',
  //       'Priority': 'u=1',
  //       'Connection': 'keep-alive',
  //       'Referer': 'https://nspd.gov.ru/map',
  //       'rejectUnauthorized': false,
  //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
  //     },
  //     method: 'GET',
  //     timeout: 1000 * 6,
  //     url: url
  //   })

  //   historyCadPrice = nspdData?.data?.data

  // } catch {
  //   historyCadPrice =[]
  // }

  try {
    const url = `	https://gcadastr.su/api/hystory?cadNum=${cadNum}`
    let nspdData = await axios({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Host': 'nspd.gov.ru',
        'Priority': 'u=1',
        'Connection': 'keep-alive',
        'Referer': 'https://nspd.gov.ru/map',
        'rejectUnauthorized': false,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
      },
      method: 'GET',
      timeout: 1000 * 6,
      url: url
    })

    historyCadPrice = nspdData?.data

  } catch {
    historyCadPrice =[]
  }


  if (historyCadPrice.length !== 0) {
    object = {
      ...object,
      historyCadPrice
    }
  }


  const cadCostHtml = CadastrCostPdfGenerator({object})


      // Генерация PDF1 и PDF2
  const expressPdf = await generatePDF(expressHtml, cadNumber, 'express');
  const cadastrPricePdf = await generatePDF(cadCostHtml, cadNumber, 'cadprice');

  await sendEmails(clientEmail, [expressPdf, cadastrPricePdf]);

  function generatePDF(htmlContent, cadastrNumber, fileNameSuffix) {
    return new Promise((resolve, reject) => {
      const modifiedString = cadastrNumber.replace(/:/g, '-');
      const pdfFilePath = path.join(`./public/expressPdf/${modifiedString}-${fileNameSuffix}.pdf`);

      pdf.create(htmlContent, {
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        },
        format: "A2",
        border: {
          top: '75px',
          right: '50px',
          bottom: '50px',
          left: '50px'
        },
      }).toFile(pdfFilePath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        console.log('СОЗДАН PDF', pdfFilePath);
        resolve(pdfFilePath);
      });
    });
  }

  // Функция для отправки писем с вложениями
  async function sendEmails(clientEmail, pdfFilePaths) {
    const messageToClient = {
      from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
      to: clientEmail,
      subject: `Заказанные отчеты`,
      html: `
      <p>Здравствуйте, ранее вы оплатили заказ, ваш экспресс отчет и справка о кадастровой стоимости во вложении.</p>
      <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>
      <p>Дополнительная информация:</p>
      <p>Наш телеграмм бот для заказа отчетов:  https://t.me/goskadastrBot</p>
      <p>Предлагаем  дистанционное  выполнение  кадастровых  работ  по выгодным
      ценам, а именно:</p>
        <ul>
          <li>Ситуационный план (для подачи в горэлектросети).</li>
          <li>СПОЗУ - Схема планировочной организации земельного участка выполняются на основе разрешения на строительство.</li>
          <li>Решение собственников о разделе.</li>
          <li>Раздел земельного участка на несколько участков (с подачей/без подачи межевого плана).</li>
          <li>Объединение нескольких участков в один (с подачей/без подачи межевого плана).</li>
          <li>Другие кадастровые работы.</li>
        </ul>
        <p>За подробной информацией обращайтесь в ответном письме.</p>
      `,
      attachments: pdfFilePaths.map(path => ({ path }))
    }

    const messageToAdmin = {
      from: clientEmail,
      to: 'admin@cadmap.su',
      subject: `${cadNumber} - Уведомление о новом платеже`,
      html:`
      <p>Поступил новый заказ</p>
      <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
      <p><b>Заказанные услуги:</b></p>
      ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
      <p>Номер заказа: <b>${numberOfOrder}</b></p>
      <p>Сумма заказа: <b>${summa}</b></p>
      <p>Сумма дохода: <b>${incomeSumma}</b></p>
      `,
      attachments: pdfFilePaths.map(path => ({ path }))
    };

    await mailer(messageToClient);
    console.log('ОТПРАВЛЕНЫ ОТЧЕТЫ КЛИЕНТУ');

    await mailer(messageToAdmin);
    console.log('ОТПРАВЛЕНЫ ОТЧЕТЫ АДМИНУ');

    setTimeout(() => {
      pdfFilePaths.forEach(filePath => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }
          console.log('File successfully deleted:', filePath);
        });
      });
    }, 30000);
    console.log('ОТЧЕТЫ УДАЛЕНЫ');
    // res.status(200).send('ok')
  }
} catch {
  const messageToAdmin = {
    from: clientEmail,
    to: 'admin@cadmap.su',
    subject: `${cadNumber} - Уведомление о новом заказе с ошибкой`,
    html:`
    <p>Поступил новый заказ, но при создании отчета произошла ошибка и отчеты не были отправлены</p>
    <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
    <p><b>Заказанные услуги:</b></p>
    ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
    <p>Номер заказа: <b>${numberOfOrder}</b></p>
    <p>Сумма заказа: <b>${summa}</b></p>
    <p>Сумма дохода: <b>${incomeSumma}</b></p>
    `,
  };


  await mailer(messageToAdmin);
  console.log('ОТПРАВЛЕНО ПИСЬМО АДМИНУ ОБ ОШИБКЕ');
}
res.status(200).send('ok')

} else {
    const message = {
      from: 'Кадастровый сервис cadmap.su <admin@cadmap.su>',
      to: clientEmail,
      subject: `Вы оплатили заказ №${numberOfOrder} на сайте cadmap.su`,
      html: `
      <p>Здравствуйте. Мы получили оплату и уже работаем над вашим заказом №${numberOfOrder}.</p>
      <p><b>В работе следующие услуги:</b></p>
      <ul>
      ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
      </ul>
      <p>Заказ будет отправлен на указанный почтовый ящик сразу же после исполнения.</p>
      <p>Спасибо, что выбрали нас. С уважением, кадастровый сервис Госкадастр</p>`
    }

    await mailer(message)

    const adminMessage = {
      from: clientEmail,
      to: 'admin@cadmap.su',
      subject: `${cadNumber} - Уведомление о новом платеже`,
      html:`
      <p>Поступил новый заказ</p>
      <p>Дата формирования заявки: ${day}.${monthReal}.${year} ${hour}:${minutes}</p>
      <p><b>Заказанные услуги:</b></p>
      ${outputObject().map((it) => `<p>${it.props.children}</p>`).join('\n')}
      <p>Ссылка на полигон: <b>${link}</b></p>
      <p>Номер заказа: <b>${numberOfOrder}</b></p>
      <p>Сумма заказа: <b>${summa}</b></p>
      <p>Сумма дохода: <b>${incomeSumma}</b></p>
      `
    }
    await mailer(adminMessage)
    res.status(200).send('ok')
  }
  // res.status(200).send('ok')
}
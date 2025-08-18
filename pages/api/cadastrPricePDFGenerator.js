import { MongoClient } from 'mongodb'
import axios from 'axios'
import UserAgent from 'user-agents';
import path from 'path';
import fs from 'fs';
import pdf from 'html-pdf';
import CadastrCostPdfGenerator from "@/Components/cadastrCostPdfGenerator";
import { getGeoportalUrls } from '@/libs/urls';
import https from 'https';

const userAgent = new UserAgent()
const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function result(req, res) {
  const resultData = req.body
  const cadNum = resultData?.cadNumber
  const modifiedString = cadNum.replace(/:/g, '-');

  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  // const collection = db.collection('searchingObjects')


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

  const geoportalUrls = getGeoportalUrls(cadNum);


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
  });

}
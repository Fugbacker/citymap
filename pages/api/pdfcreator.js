import axios from "axios";
import cheerio from 'cheerio';
import path from 'path';
import fs from 'fs';
import pdf from 'html-pdf';
import { MongoClient } from 'mongodb'
import CadastrCostPdfGenerator from "@/Components/cadastrCostPdfGenerator";


const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function handler(req, res) {

  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('searchingObjects')
  function processCadastralNumber(cadastralNumber) {
    const blocks = cadastralNumber.split(':');
    const processedBlocks = blocks.map(block => {
      if (block === '0') {
        return '0'; // если блок состоит из всех нулей, оставляем один ноль
      } else {
        let clearedBlock = block.replace(/^0+/, ''); // убираем ведущие нули
        if (clearedBlock === '') {
          return '0'; // если блок был полностью составлен из нулей, оставляем один ноль
        }
        return clearedBlock.replace(/(^|:)0+/g, '$1'); // убираем нули, оставляя по одному в каждом блоке
      }
    });
    const processedCadastralNumber = processedBlocks.join(':');
    return processedCadastralNumber;
  }

  const cadastrNumber = '47:14:901004:1817'
  const object = await collection.findOne({objectId: processCadastralNumber(cadastrNumber)})
  // const cadastrNumber = req.body.cadastrNumber
  // const cadastrNumber = '63:06:0104013:953'
  // const modifiedString = cadastrNumber.replace(/:/g, '-');
  // const websiteUrl = 'http://localhost:3000/justifycontentcenter/63:06:0104013:953'; // Замените на ваш URL
  // const response = await axios.get(websiteUrl);
  // const $ = cheerio.load(response.data);

  // const htmlContent = $('div.first').html()

//   const htmlWithImage = `
//   <html>
//     <head>
//       <title>PDF с изображением</title>
//     </head>
//     <body>

//       ${htmlContent}
//     </body>
//   </html>
// `;

  const options = {
    format: "A2",
    border: {
      top: '100px',
      right: '50px',
      bottom: '50px',
      left: '50px',
    }
  }



  const pdfFilePath = path.join(`./public/expressPdf/example.pdf`);
  const htmlWithImage = CadastrCostPdfGenerator({object})

  pdf.create(htmlWithImage, options).toFile(pdfFilePath, (err, filePath) => {
    if (err) {
      res.status(500).json({ error: 'Ошибка при создании PDF' });
      return;
    }

    const fileStream = fs.createReadStream(filePath.filename);
    const stat = fs.statSync(filePath.filename);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');

    fileStream.pipe(res);

    // setTimeout(() => {
    //   fs.unlink(pdfFilePath, (err) => {
    //     if (err) {
    //       console.error('Ошибка при удалении файла:', err);
    //       return;
    //     }
    //     console.log('Файл успешно удален:', pdfFilePath);
    //   });
    // }, 10000); // 10 секунд
  });

}
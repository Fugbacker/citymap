// pages/api/generate-pdf.js

import axios from 'axios';
import cheerio from 'cheerio';
import pdf from 'html-pdf';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { cadNumber } = req.query;

  try {
    // Подготовка URL для запроса
    const modifiedString = cadNumber.replace(/:/g, '-');
    const websiteUrl = `https://cadmap.su/justifycontentcenter/${cadNumber}`;

    // Получение HTML-данных с сайта
    const response = await axios.get(websiteUrl);
    const $ = cheerio.load(response.data);
    const htmlContent = $('div.first').html();

    // Вставляем HTML контент в шаблон с изображением
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

    // Путь для сохранения PDF
    const pdfFilePath = path.join(`./public/expressPdf/${modifiedString}.pdf`);

    // Создание PDF
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

      // Отправляем PDF в ответе
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${modifiedString}.pdf`);
      fileStream.pipe(res);
    });
  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
    res.status(500).json({ error: 'Не удалось создать PDF' });
  }
}

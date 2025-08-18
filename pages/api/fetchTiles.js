import axios from 'axios';
import { MongoClient } from 'mongodb';
import http from 'http';
import https from 'https';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cadastrDB';
const client = new MongoClient(uri);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBbox(x, y, z) {
  const tileSize = 1024;
  const initialResolution = (2 * Math.PI * 6378137) / tileSize;
  const originShift = (2 * Math.PI * 6378137) / 2.0;
  const resolution = initialResolution / Math.pow(2, z);

  const minX = x * tileSize * resolution - originShift;
  const maxY = originShift - y * tileSize * resolution;
  const maxX = (x + 1) * tileSize * resolution - originShift;
  const minY = originShift - (y + 1) * tileSize * resolution;

  return [minX, minY, maxX, maxY];
}

async function saveTile({ z, x, y, type, bbox, data }) {
  const db = client.db();
  const collection = db.collection('cadastrMap');

  await collection.updateOne(
    { z, x, y, type },
    {
      $set: {
        z,
        x,
        y,
        type,
        bbox,
        tile: Buffer.from(data),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

// URL-итератор
let urlIndex = 0;

async function fetchTile({ x, y, z, type, urlTemplates, currentIndex, total }) {
  const bboxArr = getBbox(x, y, z);
  const bbox = bboxArr.join(',');
  const mode = type === '36048' ? 'ZU' : type === '36049' ? 'BULDS' : 'ZU';

  // Берём следующий URL по кругу
  const sourceUrl = urlTemplates[urlIndex];
  urlIndex = (urlIndex + 1) % urlTemplates.length;

  const url = sourceUrl
    .replace(/\${bbox}/g, bbox)
    .replace(/\${type}/g, type)
    .replace(/\${mode}/g, mode)
    .replace(/\${Math\.random\(\)}/g, Math.random().toString());

  const headers = {
    'User-Agent': 'Mozilla/5.0',
  };

  if (url.includes('geo.mapbaza.ru')) {
    headers['Host'] = 'geo.mapbaza.ru';
    headers['Referer'] = 'https://map.ru/';
  }

  const label = `z=${z}, x=${x}, y=${y}, type=${type}`;
  console.log(`🔄 [${currentIndex}/${total}] ⬇️ ${label}`);
  console.log('🌐 URL:', url);
  console.log('🧾 Headers:', headers);

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000,
      headers,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
    });

    await saveTile({ z, x, y, type, bbox: bboxArr, data: response.data });
    console.log(`✅ [${currentIndex}/${total}] Сохранено: ${label}`);
  } catch (err) {
    console.warn(`❌ [${currentIndex}/${total}] Ошибка: ${label} — ${err.message}`);
  }
}

export default async function handler(req, res) {
  try {
    console.log('🔗 Подключение к MongoDB...');
    await client.connect();
    console.log('✅ Подключено к MongoDB');

    const typeList = ['36048', '36049'];
    const zRange = [5];
    const delayMs = 1000;

    const urlTemplates = [
      `https://geo.mapbaza.ru/geoserver/postgis/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=postgis:layer_\${type}&CRS=EPSG:3857&WIDTH=1024&HEIGHT=1024&BBOX=\${bbox}`,
      `https://data.j4web.ru/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://a.balour.ru/pkk.php?mode=\${mode}&bbox=\${bbox}`,
      `https://data.komputerwzhik.ru/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://data.inetzar.ru/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://data.egrpn365.ru/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://b.balour.ru/pkk.php?mode=\${mode}&bbox=\${bbox}`,
      `https://data.kadastrmapp.online/api/aeggis/v4/\${type}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=\${type}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=646&J=214&WIDTH=1140&HEIGHT=575&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://c.balour.ru/pkk.php?mode=\${mode}&bbox=\${bbox}`,
      `https://data.binarix.ru/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://pkk.reestr54.ru/tiles/?bbox=\${bbox}&layer=\${type}`,
      `https://data.kadastrmapp.online/api/aeggis/v4/\${type}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=\${type}&RANDOM=\${Math.random()}&WIDTH=1024&HEIGHT=1024&CRS=EPSG:3857&BBOX=\${bbox}`,
      `https://gcadastr.su/api/tiles?type=\${type}&bbox=\${bbox}`,
    ];

    const totalTiles = typeList.reduce((acc, type) =>
      acc + zRange.reduce((sum, z) => sum + Math.pow(2, z) ** 2, 0), 0);
    const totalRequests = totalTiles * urlTemplates.length;

    console.log(`🔢 Всего тайлов: ${totalTiles}`);
    console.log(`🔢 Всего запросов: ${totalRequests}`);

    let currentIndex = 1;

    for (const type of typeList) {
      for (const z of zRange) {
        const tilesCount = Math.pow(2, z);
        for (let x = 0; x < tilesCount; x++) {
          for (let y = 0; y < tilesCount; y++) {
            await fetchTile({ x, y, z, type, urlTemplates, currentIndex, total: totalRequests });
            currentIndex++;
            await sleep(delayMs);
          }
        }
      }
    }

    console.log('🎉 Загрузка тайлов завершена');
    res.status(200).send('🎉 Загрузка тайлов завершена\n');
  } catch (err) {
    console.error('❗ Ошибка:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Ошибка: ' + err.message });
    }
  } finally {
    await client.close();
  }
}

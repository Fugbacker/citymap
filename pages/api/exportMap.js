// pages/api/exportMap.js

export default function handler(req, res) {
  const { bbox, type, id } = req.query;


  // Функция для получения выбранного типа
  function getSelectedType(type) {
      switch (parseInt(type, 10)) {
          case 7:
              return 'BordersGKNSelected';
          case 10:
              return 'ZONESSelected';
          default:
              return 'CadastreSelected';
      }
  }

  // Функция для получения layerDefs
  function getLayerDefs(type, id) {
    switch (parseInt(type, 10)) {
        case 10:
            return `{ "0": "ID = ${id}", "1": "objectid = -1", "2": "objectid = -1", "6": "objectid = -1" }`;
        default:
            return `{"6": "ID = '${id}'", "7": "ID = '${id}'", "8": "ID = '${id}'", "9": "ID = '${id}'"}`;
    }
  }

  // Функция для получения слоев
  function getLayers(type) {
      switch (parseInt(type, 10)) {
          case 10:
              return 'show:0,1,2,6';
          case 5:
              return 'show:0,1,2,3,4,5';
          default:
              return 'show%3A6,7,8,9';
      }
  }

  const layerDefs = encodeURIComponent(getLayerDefs(type, id));
  const selectedType = getSelectedType(type);
  const layers = getLayers(type);


  const url = `https://pkk.torgi.me/arcgis/rest/services/PKK6/${selectedType}/MapServer/export?dpi=96&transparent=true&format=png32&layers=${layers}&bbox=${bbox}&bboxSR=102100&imageSR=102100&layerDefs=${layerDefs}&f=image`;


  // Ответ на запрос
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ url });
}
export const getClickUrls = (inputType, convertedType, bbox, z, x, y) => [
  `https://data.binarix.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.3witcher.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.vestateam.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.kakrasti.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.russifiers.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.inetzar.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.egrn-online.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.zhivemtut.online/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.bigkitty.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=1029&J=104&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://pkk.reestrn.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.gameslog.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=${inputType}&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&INFO_FORMAT=application/json&FEATURE_COUNT=10&I=172&J=34&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://gcadastr.su/api/click?type=${inputType}&bbox=${bbox}`,
];

export const getTileUrls = (inputType, convertedType, bbox, z, x, y) => [
  `https://data.binarix.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.3witcher.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.vestateam.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.kakrasti.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://pkk.reestr54.ru/tiles/?bbox=${bbox}&layer=${inputType}`,
  // `https://api.roscadastres.com/tiles/raster/${z}/${x}/${y}`,
  `https://data.zhivemtut.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.inetzar.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.egrn-online.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.russifiers.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.bigkitty.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://pkk.reestrn.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://data.gameslog.ru/api/aeggis/v4/${inputType}/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=${inputType}&RANDOM=${Math.random()}&WIDTH=512&HEIGHT=512&CRS=EPSG:3857&BBOX=${bbox}`,
  `https://geo.mapbaza.ru/geoserver/postgis/wms?REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0&FORMAT=image/png&STYLES=&TRANSPARENT=true&LAYERS=postgis:layer_${inputType}&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX=${bbox}`,
  `https://gcadastr.su/api/tiles?type=${inputType}&bbox=${bbox}`,
];

export const getGeoportalUrls = (cadNum) => [
  `https://data.3witcher.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.binarix.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.vestateam.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.inetzar.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.bigkitty.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.zhivemtut.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.egrn-online.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://pkk.reestrn.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.gameslog.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.russifiers.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.kakrasti.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://gcadastr.su/api/search?cadNumber=${cadNum}`,

  ];

export const getHistoryUrls = (cadNum) => [
  `https://data.3witcher.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.binarix.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.vestateam.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.bigkitty.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.egrn-online.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.inetzar.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.zhivemtut.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://pkk.reestrn.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.gameslog.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.russifiers.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://data.kakrasti.ru/api/geoportal/v2/search/geoportal?query=${cadNum}`,
  `https://gcadastr.su/api/hystory?cadNumber=${cadNum}`,
];


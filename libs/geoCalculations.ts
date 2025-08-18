// Геодезические расчеты для Yandex Maps
export const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371000; // Радиус Земли в метрах
  const lat1 = coord1[0] * Math.PI / 180;
  const lat2 = coord2[0] * Math.PI / 180;
  const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const calculatePolygonArea = (coordinates: [number, number][]): number => {
  if (coordinates.length < 3) return 0;

  const R = 6371000; // Радиус Земли в метрах
  let area = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (i + 1) % coordinates.length;
    const lat1 = coordinates[i][0] * Math.PI / 180;
    const lat2 = coordinates[j][0] * Math.PI / 180;
    const lng1 = coordinates[i][1] * Math.PI / 180;
    const lng2 = coordinates[j][1] * Math.PI / 180;

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs(area * R * R / 2);
  return area;
};

export const formatDistance = (distance: number): string => {
  if (distance < 1000) {
    return `${Math.round(distance)} м`;
  } else {
    return `${(distance / 1000).toFixed(2)} км`;
  }
};

export const formatArea = (area: number): string => {
  if (area < 10000) {
    return `${Math.round(area)} м²`;
  } else if (area < 1000000) {
    return `${(area / 10000).toFixed(2)} га`;
  } else {
    return `${(area / 1000000).toFixed(2)} км²`;
  }
};

export const getPolygonCenter = (coordinates: [number, number][]): [number, number] => {
  let centerLat = 0;
  let centerLng = 0;

  coordinates.forEach(coord => {
    centerLat += coord[0];
    centerLng += coord[1];
  });

  return [centerLat / coordinates.length, centerLng / coordinates.length];
};

export const getMidPoint = (coord1: [number, number], coord2: [number, number]): [number, number] => {
  return [
    (coord1[0] + coord2[0]) / 2,
    (coord1[1] + coord2[1]) / 2
  ];
};
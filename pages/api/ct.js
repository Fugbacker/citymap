import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function chart(req, res) {
  const data = req.body


  try {
    const lowerCornerCoords = data.lowerCorner.split(' ').map(Number);
    const upperCornerCoords = data.upperCorner.split(' ').map(Number);

    // Функция для трансформации координат
    const transformCoordinates = async (lat, lng) => {
      const response = await axios(`https://epsg.io/srs/transform/${lat},${lng}.json?key=default&s_srs=4326&t_srs=3857`);
      return response.data.results[0]; // возвращаем результат преобразования
    };

    // Преобразование координат
    const coordinatePoints = await Promise.all([
      transformCoordinates(lowerCornerCoords[1], lowerCornerCoords[0]), // передаем (lat, lng) в запросе
      transformCoordinates(upperCornerCoords[1], upperCornerCoords[0])
    ]);

    // Формируем объект с преобразованными координатами
    const transformedData = {
      lowerCorner: `${coordinatePoints[0].x} ${coordinatePoints[0].y}`,
      upperCorner: `${coordinatePoints[1].x} ${coordinatePoints[1].y}`
    };


    return res.json(transformedData)

  } catch {
    return res.json('error')
  }
}
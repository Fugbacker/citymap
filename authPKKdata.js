const { MongoClient } = require('mongodb')
const axios = require('axios');
const https = require('https');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

module.exports = {
  authPkk: async function authPkk() {

    await client.connect()
    const db = client.db(process.env.MONGO_COLLECTION)
    const collection = db.collection('pkk')
    const pkkDataAuth = await collection.findOne()
    const refreshToken = pkkDataAuth?.refresh_token
    console.log('refreshToken')
    try {
    // URL, куда отправляем запрос
      const url = 'https://sso.nspd.gov.ru/oauth2/token';

      // Данные для отправки
      const data = {
        grant_type: 'refresh_token',
        client_id: 'nspd',
        refresh_token: refreshToken,
      };

      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
        'Access-Control-Allow-Origin': '*',
      };

      // Отправляем POST запрос
      const response = await axios.post(url, data, { headers, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });

      if (refreshToken) {
        // Если данные уже есть в коллекции, обновляем их
        await collection.updateOne({}, { $set: response.data });
        console.log('Данные обновлены в коллекции');
      } else {
        // Если данных нет в коллекции, вставляем новую запись
        await collection.insertOne(response.data);
        console.log('Новая запись добавлена в коллекцию');
      }


    } catch(e){
      console.error('Ошибка при обновлении счетчика: ', e)
    }
    return
  }
}

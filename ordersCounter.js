const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const client = new MongoClient(url, { useUnifiedTopology: true });

module.exports = {
  counterMaker: async function counterMaker() {
    await client.connect();
    const db = client.db(process.env.MONGO_COLLECTION);
    const collection = db.collection('counter');

    await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Устанавливаем 00:00:00

      const counter = await collection.findOne();

      if (counter) {
        const counterDate = new Date(counter.createdAt);
        const counterDay = new Date(counterDate.getFullYear(), counterDate.getMonth(), counterDate.getDate());

        if (counterDay < today) {
          // Если запись устарела (из предыдущего дня), сбрасываем счетчик
          await collection.updateOne({}, { $set: { value: 0, createdAt: now } });
        } else {
          // Обновляем текущий счетчик
          const randomIncrement = Math.floor(Math.random() * 3) + 1;
          await collection.updateOne({}, { $inc: { value: randomIncrement } });
        }
      } else {
        // Если записи нет, создаем новую
        await collection.insertOne({ value: 0, createdAt: now });
      }
    } catch (e) {
      console.error('Ошибка при обновлении счетчика:', e);
    }
  }
};

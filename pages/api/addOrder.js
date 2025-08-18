import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function addOrder(req, res) {
  const orderData = req.body
  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('goscadastrOrders')
  await collection.insertOne(orderData)
  return res.json('order was added')
}
import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })

export default async function result(req, res) {
  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('counter')
  const counter = await collection.findOne()
  res.json(counter?.value)
}
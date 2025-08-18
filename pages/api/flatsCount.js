import axios from "axios"
import { MongoClient } from 'mongodb'

const url = process.env.MONGO_URL
const client = new MongoClient(url, { useUnifiedTopology: true })
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const cadastrUrl = process.env.CADASTR_URL


export default async function tooltips(req, res) {
  await client.connect()
  const db = client.db(process.env.MONGO_COLLECTION)
  const collection = db.collection('flats')
  const array = await collection.find().toArray()
  return res.json(array)
}
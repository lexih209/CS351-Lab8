
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI is not configured');
}

const client = new MongoClient(uri);

let connectionPromise;

async function connectToDatabase() {
  if (!connectionPromise) {
    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  return client.db('shoppingsite');
}

async function getCustomersCollection() {
  const db = await connectToDatabase();
  return db.collection('customers');
}

module.exports = {
  connectToDatabase,
  getCustomersCollection
};

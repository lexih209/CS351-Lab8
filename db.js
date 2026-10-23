/**
 * Connection to the shoppingsite database.
 * Set MONGODB_URI to the connection string before starting the app.
 */

var { MongoClient } = require('mongodb');

var client;

async function getCustomersCollection() {
  var uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Set MONGODB_URI to the shoppingsite connection string.');
  }
  if (!client) {
    client = new MongoClient(uri);
  }
  await client.connect();
  return client.db('shoppingsite').collection('customers');
}

module.exports = { getCustomersCollection };

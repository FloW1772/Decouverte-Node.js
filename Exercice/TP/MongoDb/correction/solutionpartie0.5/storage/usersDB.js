const uuid = require('uuid')
const { MongoClient } = require("mongodb");

const uri = 'mongodb://localhost:27017/express-brains';
const client = new MongoClient(uri);

const db = client.db('express-brains');

client.connect().then(async () => {
  console.log('Connexion réussie !');
  await db.collection('users');
});

async function addUser (email, password, role='user') {
  const collection = await db.collection('users');
  const result = await collection.insertOne({ uuid: uuid.v4(), email: email, password: password, role: role });
  return result.insertedId;
}

async function findByEmail (email) {
  const collection = await db.collection('users');
  const user = collection.findOne({ email: email });
  return user
}

async function findAll () {
  const collection = await db.collection('users');
  const users = collection.find().toArray();
  return users
}

module.exports = {
  addUser,
  findByEmail,
  findAll  
}

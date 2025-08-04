const uuid = require('uuid')
const { MongoClient } = require("mongodb");

const uri = 'mongodb://localhost:27017/express-brains';
const client = new MongoClient(uri);

const db = client.db('express-brains');

client.connect().then(async () => {
  console.log('Connexion réussie !');
  await db.collection('users');
});

async function addUser (email, pseudo, password, role='user') {
  const collection = await db.collection('users');
  const result = await collection.insertOne({ uuid: uuid.v4(), email: email, pseudo: pseudo, password: password, role: role });
  return result.insertedId;
}

async function findByEmail (email) {
  const collection = await db.collection('users');
  const user = await collection.findOne({ email: email });
  return user
}

async function findByPseudo (pseudo) {
  const collection = await db.collection('users');
  const user = await collection.findOne({ pseudo: pseudo });
  return user
}

async function findAll () {
  const collection = await db.collection('users');
  const users = await collection.find().toArray();
  return users
}

module.exports = {
  addUser,
  findByEmail,
  findByPseudo,
  findAll  
}

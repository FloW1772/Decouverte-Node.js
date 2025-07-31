const uuid = require('uuid')
const { UserModel } = require('../models/User');

async function addUser (email, pseudo, password, role='user') {
  const newUser = new UserModel({
    uuid: uuid.v4(),
    email: email,
    pseudo: pseudo,
    password: password,
    role: role
  });
  await newUser.save();
  return newUser;
}

async function findByEmail (email) {
  const user = await UserModel.findOne({ email: email });
  return user
}

async function findByPseudo (pseudo) {
  const user = await UserModel.findOne({ pseudo: pseudo });
  return user
}

async function findAll () {
  const users = await UserModel.find();
  return users
}

module.exports = {
  addUser,
  findByEmail,
  findByPseudo,
  findAll  
}

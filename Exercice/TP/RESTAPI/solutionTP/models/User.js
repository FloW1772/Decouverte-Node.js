const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    uuid: String,
    email: String,
    pseudo: String,
    password: String,
    role: String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = {
    UserModel
}
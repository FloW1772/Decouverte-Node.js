const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nom_de_ta_base', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

module.exports = db;

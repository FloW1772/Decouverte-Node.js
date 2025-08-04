const mongoose = require('mongoose');
const Game = require('./models/GameSession'); // adapte le chemin si besoin

// Connexion à la base MongoDB (même URL que dans config/db.js)
mongoose.connect('mongodb://localhost:27017/nom_de_ta_base', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion MongoDB:'));
db.once('open', async () => {
  console.log('Connecté à MongoDB');

  const gamesToInsert = [
  {
    username: 'Alice',
    attempts: 4,
    timeSpent: 100,
    numberToFind: 24,
    isFinished: true
  },
  {
    username: 'Bob',
    attempts: 6,
    timeSpent: 150,
    numberToFind: 42,
    isFinished: true
  },
  {
    username: 'Charlie',
    attempts: 3,
    timeSpent: 80,
    numberToFind: 15,
    isFinished: true
  },
];


  try {
    // On vide la collection avant d'insérer (optionnel)
    await Game.deleteMany({});
    // Insertion des données
    await Game.insertMany(gamesToInsert);
    console.log('Données insérées avec succès');
  } catch (err) {
    console.error('Erreur lors de l’insertion:', err);
  } finally {
    mongoose.connection.close();
  }
});

const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/nom_de_ta_base', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', async () => {
  try {
    await User.deleteMany({});
    console.log('Utilisateurs supprimés.');

    await User.create([
      {
        pseudo: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      },
      {
        pseudo: 'user1',
        email: 'user1@example.com',
        password: 'pass123',
        isAdmin: false
      }
    ]);

    console.log('Utilisateurs ajoutés.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur :', error);
    mongoose.connection.close();
  }
});

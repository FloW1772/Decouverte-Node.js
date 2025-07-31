const express = require('express');
const argon2 = require('argon2');
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');
const storage = require('../storage/users'); // ← ton fichier users.js dans /storage

const router = express.Router();

let numberToFind;

// === ROUTES DU JEU ===
router.get('/', (req, res) => {
  if (!numberToFind) {
    numberToFind = RandomNumber.generate();
  }
  res.render('index');
});

router.post('/', (req, res) => {
  const attempt = parseInt(req.body.attempt);
  const playAgain = req.body.playAgain;

  if (playAgain) {
    numberToFind = RandomNumber.generate();
    res.render('index');
  } else {
    const response = tryNumber(attempt, numberToFind);
    res.render('index', { result: response });
  }
});

// === ROUTES LOGIN ===
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = storage.findByEmail(email);

  if (!user) {
    req.flash('error', 'Utilisateur inconnu.');
    return res.redirect('/login');
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    req.flash('error', 'Mot de passe incorrect.');
    return res.redirect('/login');
  }

     req.session.user = { uuid: user.uuid, email: user.email, role: user.role };
  req.flash('success', `Bienvenue ${user.email} !`);
  res.redirect('/');
});

// === ROUTES REGISTER ===
router.get('/register', (req, res) => {
  const isAdmin = req.session.user && req.session.user.role === 'admin';
  res.render('register', { isAdmin });
});


router.post('/register', async (req, res) => {
  const { email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    req.flash('error', 'Les mots de passe ne correspondent pas.');
    return res.redirect('/register');
  }

  if (storage.findByEmail(email)) {
    req.flash('error', 'Un compte avec cet email existe déjà.');
    return res.redirect('/register');
  }

  // Seuls les admins connectés peuvent créer un admin
  let assignedRole = 'user';
  if (req.session.user && req.session.user.role === 'admin' && role === 'admin') {
    assignedRole = 'admin';
  }

  const hashedPassword = await argon2.hash(password);
  storage.addUser(email, hashedPassword, assignedRole);

  req.flash('success', 'Compte créé avec succès. Vous pouvez vous connecter.');
  res.redirect('/login');
});



// === LISTE DES UTILISATEURS ===
router.get('/users', (req, res) => {
  const users = storage.findAll();
  res.render('users', { users });
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;

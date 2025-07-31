const express = require('express');
const { body } = require('express-validator');
const argon2 = require('argon2');
const User = require('../models/User');  // au lieu de findByEmail
const router = express.Router();

// Page de login
router.get('/', (req, res) => {
  res.render('login', {
    activePage: 'login',
    user: req.session.user
  });
});

// Traitement du login
router.post('/', 
  body('email').isEmail().withMessage('Identifiants invalides !'),
  body('password').isLength({ min: 1 }).withMessage('Identifiants invalides !'),
  async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (user && await argon2.verify(user.password, req.body.password)) {
        req.session.user = user;
        req.flash('success', 'Bienvenue ' + user.email + ' !');
        return res.redirect('/');
      } else {
        req.flash('error', 'Identifiants invalides !');
        return res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erreur lors de la connexion.');
      return res.redirect('/login');
    }
  }
);

// Page d’inscription
router.get('/register', (req, res) => {
  res.render('register', {
    activePage: 'register',
    user: req.session.user
  });
});

// Traitement de l’inscription
router.post('/register', async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ pseudo: pseudo.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'Ce pseudo est déjà utilisé.');
      return res.redirect('/login/register');
    }

    // Hasher le mot de passe avant de sauvegarder
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({ pseudo, email, password: hashedPassword });
    await newUser.save();

    req.flash('success', 'Compte créé avec succès !');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erreur lors de la création du compte.');
    res.redirect('/login/register');
  }
});

module.exports = router;

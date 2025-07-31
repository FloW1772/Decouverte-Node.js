const express = require('express');
const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const User = require('../models/User');
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
  body('password').notEmpty().withMessage('Identifiants invalides !'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Identifiants invalides !');
      return res.redirect('/login');
    }

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
    user: req.session.user,
    errors: {}, // pour affichage erreurs
  });
});

// Traitement de l’inscription
router.post('/register',
  // Validation des champs
  body('pseudo').trim().notEmpty().withMessage('Le pseudo est requis.'),
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    const { pseudo, email, password } = req.body;

    if (!errors.isEmpty()) {
      // Transforme les erreurs en objet exploitable par la vue
      const mappedErrors = {};
      errors.array().forEach(err => mappedErrors[err.param] = err.msg);

      return res.render('register', {
        activePage: 'register',
        user: req.session.user,
        errors: mappedErrors
      });
    }

    try {
      const existingUser = await User.findOne({ pseudo: pseudo.toLowerCase() });
      if (existingUser) {
        req.flash('error', 'Ce pseudo est déjà utilisé.');
        return res.redirect('/login/register');
      }

      const hashedPassword = await argon2.hash(password);

      const newUser = new User({
        pseudo: pseudo.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword
      });

      await newUser.save();

      req.flash('success', 'Compte créé avec succès !');
      return res.redirect('/login');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erreur lors de la création du compte.');
      return res.redirect('/login/register');
    }
  }
);

module.exports = router;

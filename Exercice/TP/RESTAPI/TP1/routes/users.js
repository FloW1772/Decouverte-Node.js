const express = require('express');
const { body, validationResult } = require('express-validator');
const argon2 = require('argon2');
const User = require('../models/User');

const router = express.Router();

// Route : liste des utilisateurs (admin uniquement)
router.get('/', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (!req.session.user.isAdmin) {
    return res.status(403).render('error', {
      message: "Vous n'avez pas les droits pour accéder à cette page.",
      error: { status: 403, stack: 'Erreur !' },
      activePage: 'users'  // activePage ajouté ici
    });
  }

  try {
    const users = await User.find({});
    res.render('list_users', { listUsers: users, activePage: 'users' }); // activePage ajouté
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: "Erreur de chargement", error: err, activePage: 'users' });
  }
});

// Route : afficher le formulaire d'inscription
router.get('/register', (req, res) => {
  res.render('register', { activePage: 'register' }); // activePage ajouté
});

// Route : traiter l'inscription
router.post('/register',
  body('email')
    .isEmail().withMessage('Merci de saisir une adresse email valide')
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée');
      }
      return true;
    }),
  body('pseudo')
    .notEmpty().withMessage('Le pseudo est requis')
    .custom(async (value) => {
      const existingUser = await User.findOne({ pseudo: value.toLowerCase() });
      if (existingUser) {
        throw new Error('Ce pseudo est déjà utilisé');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 4 }).withMessage('Le mot de passe doit contenir au moins 4 caractères'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    let listErrors = {};
    errors.errors.forEach(e => listErrors[e.path] = e.msg);

    if (Object.keys(listErrors).length > 0) {
      return res.render('register', { errors: listErrors, activePage: 'register' }); // activePage ajouté
    }

    try {
      const hash = await argon2.hash(req.body.password);

      const newUser = new User({
        email: req.body.email,
        pseudo: req.body.pseudo.toLowerCase(),
        password: hash,
        isAdmin: false
      });

      await newUser.save();

      req.flash('success', `Votre compte ${req.body.email} a bien été créé !`);
      res.redirect('/users');
    } catch (err) {
      console.error(err);
      req.flash('error', 'Erreur lors de la création du compte.');
      res.redirect('/users/register');
    }
  }
);

module.exports = router;

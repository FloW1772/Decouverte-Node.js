const express = require('express');
const { body, validationResult } = require('express-validator');
const { addUser, findAll, findByEmail } = require('../storage/usersDB');
const argon2 = require('argon2');

const router = express.Router();

router.get('/', async (req, res) => {
  if (typeof req.session.user === 'undefined') {
    res.redirect('/login');
  } else if (req.session.user && req.session.user.role !== 'admin') {
    const error = {
      status: 403,
      stack: 'Erreur !'
    }
    res.status(403).render('error', { message: "Vous n'avez pas les droits pour accéder à cette page.", error: error });
  } else {
    const users = await findAll();
    res.render('list_users', { listUsers: users });
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', 
  body('email').isEmail().withMessage('Merci de saisir une adresse email valide'),
  body('email').custom(async (value) => {
    console.log(await findByEmail(value));
    if (await(findByEmail(value)))
      throw new Error('Cette adresse email est déjà utilisée');
    return true;
  }),
  body('password').isLength({ min: 4 }).withMessage('Doit contenir au moins 4 caractères'),
  body('confirmPassword').custom((value, { req }) => {
    if (req.body.password !== value) {
      console.log(req.body.password);
      console.log(value);
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    let listErrors = {};
    errors.errors.forEach(element => {
      listErrors[element.path] = element.msg;
    });

    if (Object.keys(listErrors).length > 0) {
      res.render('register', { errors: listErrors });
    } else {
      const hash = await argon2.hash(req.body.password);
      await addUser(req.body.email, hash);
      req.flash('success', 'Votre compte ' + req.body.email + ' a bien été créé !');
      res.redirect('/users');
    }
});

module.exports = router;

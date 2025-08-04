const express = require('express');
const { body, validationResult } = require('express-validator');
const { addUser, findAll, findByEmail, findByPseudo } = require('../storage/usersMongoose');
const argon2 = require('argon2');

const router = express.Router();

router.get('/users', async (req, res) => {
  const users = await findAll();
  res.render('list_users', { listUsers: users });
});

router.post('/register', 
  body('email').isEmail().withMessage('Merci de saisir une adresse email valide'),
  body('email').custom(async (value) => {
    if (await(findByEmail(value)))
      throw new Error('Cette adresse email est déjà utilisée');
    return true;
  }),
  body('pseudo').isLength({ min: 3 }).withMessage('Doit contenir au moins 3 caractères'),
  body('pseudo').custom(async (value) => {
    if (await(findByPseudo(value)))
      throw new Error('Ce pseudo est déjà utilisé');
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
      res.json({ errors: listErrors });
    } else {
      const hash = await argon2.hash(req.body.password);
      await addUser(req.body.email, req.body.pseudo, hash);
      res.json({ message: 'success : user created', user: req.body.email });
    }
});

module.exports = router;

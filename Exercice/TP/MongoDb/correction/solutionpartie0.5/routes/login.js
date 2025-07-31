const express = require('express');
const { body } = require('express-validator');
const argon2 = require('argon2');
const { findByEmail } = require('../storage/usersDB');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', 
    body('email').isEmail().withMessage('Identifiants invalides !'),
    body('password').isLength({ min: 1 }).withMessage('Identifiants invalides !'),
    async (req, res) => {
        const user = await findByEmail(req.body.email);
        if (user) {
            if (await argon2.verify(user.password, req.body.password)) {
                req.session.user = user;
                req.flash('success', 'Bienvenue ' + user.email + ' !');
                res.redirect('/');
            } else {
                req.flash('error', 'Identifiants invalides !');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'Identifiants invalides !');
            res.redirect('/login');
        }
    }
);

module.exports = router;
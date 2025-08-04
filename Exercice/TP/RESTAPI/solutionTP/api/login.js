const express = require('express');
const { body } = require('express-validator');
const argon2 = require('argon2');
const { findByEmail } = require('../storage/usersMongoose');

const router = express.Router();

// Dans une optique de pure API, je dégage complétement cette route
router.post('/login', 
    body('email').isEmail().withMessage('Identifiants invalides !'),
    body('password').isLength({ min: 1 }).withMessage('Identifiants invalides !'),
    async (req, res) => {
        const user = await findByEmail(req.body.email);
        if (user) {
            if (await argon2.verify(user.password, req.body.password)) {
                req.session.user = user;
                res.json({ message: 'success : user logged-in', user: user.email })
            } else {
                res.json({ message: 'error', error: 'Identifiants invalides !' })
            }
        } else {
            res.json({ message: 'error', error: 'Identifiants invalides !' })
        }
    }
);

module.exports = router;
const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User'); // adapte le chemin si besoin

// Page pour créer une équipe (protégée)
router.get('/create', isAdmin, async (req, res) => {
  try {
    const users = await User.find(); // récupère tous les utilisateurs
    res.render('create', { users }); // passe les users à la vue
  } catch (err) {
    req.flash('error', 'Erreur lors du chargement des utilisateurs.');
    res.redirect('/');
  }
});

module.exports = router;

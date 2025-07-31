const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User'); // adapte le chemin si besoin
const Team = require('../models/Team'); // ton modèle équipe

// Route pour afficher la liste des équipes via /teams/list
router.get('/list', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email');
    res.render('list', { teams });
  } catch (err) {
    req.flash('error', 'Erreur lors du chargement des équipes.');
    res.redirect('/');
  }
});

// Liste toutes les équipes avec détails membres (route par défaut /teams/)
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email'); 
    res.render('list', { teams });
  } catch (err) {
    req.flash('error', 'Erreur lors du chargement des équipes.');
    res.redirect('/');
  }
});

// Page pour créer une équipe (GET) - protégée
router.get('/create', isAdmin, async (req, res) => {
  try {
    const users = await User.find(); 
    res.render('create', { users }); 
  } catch (err) {
    req.flash('error', 'Erreur lors du chargement des utilisateurs.');
    res.redirect('/');
  }
});

// Création d'une équipe (POST) - protégée
router.post('/create', isAdmin, async (req, res) => {
  const { name, members } = req.body;

  if (!name || name.length < 4) {
    req.flash('error', 'Le nom de l\'équipe doit contenir au moins 4 caractères.');
    return res.redirect('/teams/create');
  }

  let membersArray = [];
  if (Array.isArray(members)) {
    membersArray = members;
  } else if (typeof members === 'string') {
    membersArray = [members];
  }

  if (membersArray.length < 2) {
    req.flash('error', 'L\'équipe doit contenir au moins 2 membres.');
    return res.redirect('/teams/create');
  }

  try {
    const newTeam = new Team({ name, members: membersArray });
    await newTeam.save();
    req.flash('success', 'Équipe créée avec succès !');
    res.redirect('/teams/create');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Erreur lors de la création de l\'équipe.');
    res.redirect('/teams/create');
  }
});

module.exports = router;

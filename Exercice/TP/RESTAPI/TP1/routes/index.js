const express = require('express');
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');
const GameSession = require('../models/GameSession'); // Assure-toi que le modèle est bien importé

const router = express.Router();

router.get('/', async (req, res) => {
  // Vérifie que l'utilisateur est connecté et a un pseudo
  if (!req.session.user || !req.session.user.pseudo) {
    return res.redirect('/login');
  }

  let gameSession;

  if (!req.session.sessionId) {
    // Nouvelle session de jeu
    gameSession = new GameSession({
      username: req.session.user.pseudo,
      numberToFind: RandomNumber.generate(),
      startedAt: new Date(),
      isFinished: false,
      attempts: 0,
      timeSpent: 0,
    });

    await gameSession.save();
    req.session.sessionId = gameSession._id;
  } else {
    gameSession = await GameSession.findById(req.session.sessionId);

    // Si jamais la session est introuvable, en créer une nouvelle
    if (!gameSession) {
      gameSession = new GameSession({
        username: req.session.user.pseudo,
        numberToFind: RandomNumber.generate(),
        startedAt: new Date(),
        isFinished: false,
        attempts: 0,
        timeSpent: 0,
      });
      await gameSession.save();
      req.session.sessionId = gameSession._id;
    }
  }

  console.log("Nombre à trouver :", gameSession.numberToFind);

  res.render('index', { activePage: 'home', user: req.session.user });
});

router.post('/', async (req, res) => {
  if (!req.session.user || !req.session.user.pseudo) {
    return res.redirect('/login');
  }

  const playAgain = req.body.playAgain;

  if (playAgain) {
    // Supprime l'ancienne session si besoin
    if (req.session.sessionId) {
      await GameSession.findByIdAndDelete(req.session.sessionId);
      req.session.sessionId = null;
    }
    // Crée une nouvelle session
    const gameSession = new GameSession({
      username: req.session.user.pseudo,
      numberToFind: RandomNumber.generate(),
      startedAt: new Date(),
      isFinished: false,
      attempts: 0,
      timeSpent: 0,
    });
    await gameSession.save();
    req.session.sessionId = gameSession._id;

    return res.render('index', { activePage: 'home', user: req.session.user });
  }

  // Traitement d'une tentative
  const attempt = parseInt(req.body.attempt);

  if (!req.session.sessionId) {
    // Si pas de session en cours, redirige vers la page de jeu
    return res.redirect('/');
  }

  const gameSession = await GameSession.findById(req.session.sessionId);

  if (!gameSession) {
    // Session introuvable, créer nouvelle session et rediriger
    return res.redirect('/');
  }

  // Appelle ta fonction qui teste la tentative
  const response = tryNumber(attempt, gameSession.numberToFind);

  // Mets à jour la session de jeu selon la tentative
  gameSession.attempts++;
  if (response.resultType === response.ResultTypes.CORRECT) {
    gameSession.isFinished = true;
    gameSession.finishedAt = new Date();
    // Calcul du temps passé
    gameSession.timeSpent = (gameSession.finishedAt - gameSession.startedAt) / 1000;
  }
  await gameSession.save();

  res.render('index', {
    activePage: 'home',
    user: req.session.user,
    result: response
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;

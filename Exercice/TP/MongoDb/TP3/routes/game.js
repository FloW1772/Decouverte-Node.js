const express = require('express');
const router = express.Router();
const GameSession = require('../models/GameSession');

// Middleware simple pour récupérer username si connecté
// Sinon username sera passé dans le body lors du start
function getUsername(req) {
  // Exemple : si tu utilises une session ou un token, récupère ici
  if (req.user && req.user.username) return req.user.username;
  if (req.body.username) return req.body.username;
  return 'Invité';
}

// Démarrer une nouvelle partie
router.post('/start', async (req, res) => {
  try {
    const username = getUsername(req);
    const numberToFind = Math.floor(Math.random() * 100) + 1; // nombre à trouver entre 1 et 100
    
    const gameSession = new GameSession({
      username,
      numberToFind,
      attempts: 0,
      timeSpent: 0,
      isFinished: false,
      startedAt: new Date()
    });
    
    await gameSession.save();
    res.json({ sessionId: gameSession._id, numberToFind }); // en vrai, numberToFind ne devrait pas être envoyé au client
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur au démarrage du jeu' });
  }
});

// Enregistrer une tentative
router.post('/attempt', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID requis' });

    // Incrémente tentatives
    await GameSession.findByIdAndUpdate(sessionId, { $inc: { attempts: 1 } });
    res.json({ message: 'Tentative enregistrée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur lors de la tentative' });
  }
});

// Finir la partie
router.post('/finish', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID requis' });

    const session = await GameSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session non trouvée' });

    session.isFinished = true;
    session.finishedAt = new Date();
    session.timeSpent = Math.floor((session.finishedAt - session.startedAt) / 1000);
    await session.save();

    res.json({ message: 'Partie terminée', timeSpent: session.timeSpent });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur à la fin de la partie' });
  }
});

// Afficher classement (vue EJS)
router.get('/classement', async (req, res) => {
  try {
    const sessions = await GameSession.find({ isFinished: true })
      .sort({ attempts: 1, timeSpent: 1 })
      .limit(20)
      .select('username attempts timeSpent numberToFind');

    res.render('classement', { sessions });
  } catch (err) {
    res.status(500).send('Erreur serveur lors du classement');
  }
});

module.exports = router;

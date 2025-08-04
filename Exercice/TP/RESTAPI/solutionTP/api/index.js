const express = require('express');
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');
const { ResultTypes } = require('../enums/result-types')
const { getAllRanks, addRank } = require('../storage/ranking');

const router = express.Router();

let attempts = 0;
let numberToFind = 0;
let start = 0;

// Route qui génère un nombre aléatoire si ce n'est pas déjà fait
router.get('/generate', (req, res) => {
  if (!numberToFind) {
    numberToFind = generate();
    start = Date.now();
  }
  res.json({ 'numberToFind': numberToFind });
});

// Route qui vérifie le résultat
router.post('/verify', (req, res) => {
  const attempt = parseInt(req.body.attempt);

  const response = tryNumber(attempt, numberToFind);
  attempts++;

  // Si on a trouvé le bon résultat, on le sauvegarde dans le classement
  if (response.resultType == ResultTypes.CORRECT) {
    let duration = Math.ceil((Date.now() - start) / 1000);
    const currentAttempt = attempts;
    addRank('Anonyme', currentAttempt, duration, numberToFind);

    // Réinitialisation des valeurs
    numberToFind = generate();
    start = Date.now();
    attempts = 0;

    res.json({ result: response, attempt: currentAttempt });
  } else {
    // Retourne le résultat
    res.json({ result: response, attempt: attempts });
  }
});

// Récupération du classement
router.get('/ranking', async (req, res) => {
  const ranks = await getAllRanks();
  res.json({ listRanks: ranks });
});

module.exports = router;

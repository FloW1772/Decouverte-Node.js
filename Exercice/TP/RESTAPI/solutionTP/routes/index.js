const express = require('express');
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');
const { ResultTypes } = require('../enums/result-types')
const { getAllRanks, addRank } = require('../storage/ranking');

const router = express.Router();

let attempts = 0;
let numberToFind = 0;
let start = 0;

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { start: true });
});

router.post('/', (req, res) => {
  const attempt = parseInt(req.body.attempt);
  const playAgain = req.body.playAgain;
  const startGame = req.body.startGame;

  if (startGame || playAgain) {
    start = Date.now();
    attempts = 0;
    numberToFind = RandomNumber.generate();
    console.log(numberToFind);
    res.render('index');
  } else {
    const response = tryNumber(attempt, numberToFind);
    attempts++;

    if (response.resultType == ResultTypes.CORRECT) {
      let duration = Math.ceil((Date.now() - start) / 1000);
      let pseudo = '';
      if (req.session.user && req.session.user.pseudo)
        pseudo = req.session.user.pseudo;
      else
        pseudo = 'Anonyme';
      addRank(pseudo, attempts, duration, numberToFind);
    }

    res.render('index', { result: response })
  }
});

router.get('/ranking', async (req, res) => {
  const ranks = await getAllRanks();
  res.render('ranking', { listRanks: ranks });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

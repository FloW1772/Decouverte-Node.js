const express = require('express');
const { RandomNumber } = require('../services/random-number');
const { tryNumber } = require('../services/try-number');

const router = express.Router();

let numberToFind;

/* GET home page. */
router.get('/', (req, res) => {
  if (!numberToFind) {
    numberToFind = RandomNumber.generate();
  }
  console.log(numberToFind);
  res.render('index');
});

router.post('/', (req, res) => {
  const attempt = parseInt(req.body.attempt);
  const playAgain = req.body.playAgain;

  if (playAgain) {
    numberToFind = RandomNumber.generate();
    res.render('index');
  } else {
    const response = tryNumber(attempt, numberToFind);
    res.render('index', { result: response })
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

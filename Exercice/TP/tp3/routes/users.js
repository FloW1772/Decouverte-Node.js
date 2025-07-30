const express = require('express');
const router = express.Router();
const storage = require('../storage/users');
const { requireAdmin } = require('../middlewares/auth');

router.get('/', requireAdmin, (req, res) => {
  const users = storage.findAll();
  res.render('users', { users });
});

module.exports = router;

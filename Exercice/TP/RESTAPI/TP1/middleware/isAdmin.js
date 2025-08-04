module.exports = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin === true) {
    return next();
  }
  return res.status(403).json({ message: 'Accès interdit. Réservé aux administrateurs.' });
};

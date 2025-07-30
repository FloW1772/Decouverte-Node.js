function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error', 'Accès réservé aux administrateurs.');
    return res.redirect('/login');
  }
  next();
}

module.exports = {
  requireLogin,
  requireAdmin,
};

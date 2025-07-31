require('./config/db.js');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const teamsRouter = require('./routes/teams'); // ✅ Import du routeur des équipes
const gameRouter = require('./routes/game'); // <-- Import routeur jeu

const app = express();

// Middleware pour compiler Sass si tu veux le réactiver
/*app.use(sassMiddleware({
  src: path.join(__dirname, 'bootstrap'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));*/

app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: '!changeme!',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

// Variables accessibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.user = req.session.user;
  next();
});

// Définition des routes principales
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/teams', teamsRouter); // ✅ Route pour les équipes correctement placée
app.use('/game', gameRouter);   // <-- Route pour le jeu ajoutée ici

// Gestion des 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Gestion des erreurs
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

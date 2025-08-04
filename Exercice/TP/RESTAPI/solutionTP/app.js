const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const flash = require('connect-flash');
const session = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./utils/doc/swagger_output.json');
const connection = require('./utils/connection');

// Création de mes routeurs
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

const app = express();

/*app.use(sassMiddleware({
  src: path.join(__dirname, 'bootstrap'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));*/

app.use(express.static(path.join(__dirname, 'public')))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '!changeme!',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

connection.connect();

app.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  res.locals.user = req.session.user;
  next();
});

// Définition des chemins à utiliser pour les routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
res.status(err.status || 500);
res.render('error');
});

module.exports = app;

let express = require('express');
require('dotenv').config();
let path = require('path');
let session = require('express-session');

let app = express();
module.exports = app;

let sess = {
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { maxAge: 5 * 60 * 1000 }, // 5 minutes
   httpOnly: true,
   secure: false, // Set to true if using HTTPS
};

app.use(session(sess));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

//déclaration du dossier public comme dossier statique
app.use(express.static(path.join(__dirname, 'public')));

//Routes
let ticketsRoutes = require('./routes/ticketsRoutes');
let usersRoutes = require('./routes/usersRoutes');

const port = process.env.PORT_NO || 3000;

app.listen(port, () => {
   console.log(`Serveur démarré sur http://localhost:${port}`);
});

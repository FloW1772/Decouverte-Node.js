const express = require('express');
const ejs = require('ejs');
// Initialisation d'ExpressJS
const app = express();

//configuration du moteur de template EJS
app.set('view engine', 'ejs');
 
const port = 3000;
listCities = ['Paris', 'Lyon', 'Marseille', 'Nantes', 'Rennes'];
user = {
    firstname: "Bob",
    lastname: "L'Eponge"
}
 
// Middleware global s'appliquant à toute l'application
app.use((req, res, next) => {
    console.log(req.method, req.headers['user-agent']);
    next();
});
 
// Middleware ne s'appliquant qu'aux routes "/cities/:id" et à leurs dérivés
app.use('/cities/:id', (req, res, next) => {
    console.log("Middleware : vérification de l'id")
    let id = req.params.id;
    if (id > 0 && id <= listCities.length)
        next();
    else
        res.send("Erreur : id de ville inconnu !");
});
 
// Route initiale retournant "Hello World!"
app.get('/', (req, res) => {
    res.render('index', {user: user, cities: listCities});
});
 
// Route globale retournant le tableau de villes
app.get('/cities', (req, res) => {
    res.send(listCities);
});
 
// Route retournant une ville spécifique
app.get('/cities/:id', (req, res) => {
    let id = req.params.id;
    res.send(listCities[id - 1]);
});
 
// Route retournant un objet JSON
app.get('/user', (req, res) => {
    res.json(user);
});
 
// Middleware pour les routes non définies
app.use((req, res, next) => {
    res.status(404).send("404 Page Not Found !");
});
 
// On exécute l'application sur le port spécifié plus haut
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
'use strict';

// Initialisation de l'application
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/templates');

// Déclaration du tableau d'utilisateurs
const listUsers = [
    { id: 1, name: 'Lucky Luke', role: 'admin'},
    { id: 2, name: 'Rantanplan', role: 'admin'},
    { id: 3, name: 'Joe Dalton', role: 'user'},
    { id: 4, name: 'Jack Dalton', role: 'user'},
    { id: 5, name: 'William Dalton', role: 'user'},
    { id: 6, name: 'Avrell Dalton', role: 'user'},
];

// On autorise le parsing du corps des formulaires
app.use(express.urlencoded({ extended: false }));

// Route principale listant les autres routes
app.get('/', (req, res) => {
    res.render('index');
});

// Route listant tous les utilisateurs
app.get('/users', (req, res) => {
    res.render('list-users', { title: 'Liste des utilisateurs', users: listUsers });
});

// Route listant un utilisateur en fonction de son id
app.get('/users/:id', (req, res) => {
    const user = listUsers.find(u => u.id == req.params.id);
    res.send(user);
});

// Route listant les utilisateurs "admin"
app.get('/users/role/admin', (req, res) => {
    const admin = listUsers.filter(u => u.role === 'admin');
    res.render('list-users', { title: 'Liste des administrateurs', users: admin });
});

// Route listant les utilisateurs "user"
app.get('/users/role/user', (req, res) => {
    const user = listUsers.filter(u => u.role === 'user');
    res.render('list-users', { title: 'Liste des utilisateurs "user"', users: user });
});

// Route get pour renvoyer la page d'admin
app.get('/admin', (req, res) => {
    res.render('admin');
});

app.use('/admin', (req, res, next) => {
    if (req.body.name.length > 0)
        next();
    else
        res.status(400).render('error', {error: 'Erreur : utilisateur invalide !'});
});

// Route post pour traiter le formulaire d'admin
app.post('/admin', (req, res) => {
    const newUser = {
        id: listUsers.length + 1,
        name: req.body.name,
        role: req.body.role
    }
    listUsers.push(newUser);
    res.redirect('/users');
});

// Lancement de l'application sur le port 3000
app.listen(port, () => {
    console.log('Listening on port :', port);
});
'use strict';

// Initialisation de l'application
const express = require('express');
const app = express();
const port = 3000;

// Déclaration du tableau d'utilisateurs
const listUsers = [
    { id: 10, name: 'Lucky Luke', role: 'admin'},
    { id: 2, name: 'Rantanplan', role: 'admin'},
    { id: 33, name: 'Joe Dalton', role: 'user'},
    { id: 44, name: 'Jack Dalton', role: 'user'},
    { id: 5, name: 'William Dalton', role: 'user'},
    { id: 6, name: 'Avrell Dalton', role: 'user'},
];

// Route principale listant les autres routes
app.get('/', (req, res) => {
    res.send(' - /users : liste des utilisateurs <br>' +
        ' - /users/1 : liste le 1er utilisateur <br>' +
        ' - /users/role/admin : liste les utilisateurs administrateurs <br>' +
        ' - /users/role/user : liste les utilisateurs "classiques" <br>'
    );
});

// Route listant tous les utilisateurs
app.get('/users', (req, res) => {
    res.send(listUsers);
});

// Route listant un utilisateur en fonction de son id
app.get('/users/:id', (req, res) => {
    const user = listUsers.find(u => u.id == req.params.id);
    res.send(user);
});

// Route listant les utilisateurs "admin"
app.get('/users/role/admin', (req, res) => {
    const admin = listUsers.filter(u => u.role === 'admin');
    res.send(admin);
});

// Route listant les utilisateurs "user"
app.get('/users/role/user', (req, res) => {
    const user = listUsers.filter(u => u.role === 'user');
    res.send(user);
});

// Lancement de l'application sur le port 3000
app.listen(port, () => {
    console.log('Listening on port :', port);
});
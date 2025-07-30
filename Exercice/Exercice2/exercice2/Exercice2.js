const express = require('express');
const app = express();
const port = 3000;

// Liste des utilisateurs en dur
const users = [
    { id: 1, name: "John Doe", role: "admin" },
    { id: 2, name: "Jane Smith", role: "user" },
    { id: 3, name: "Bob Wilson", role: "user" },
    { id: 4, name: "Alice Brown", role: "admin" },
];

// Route principale listant toutes les routes disponibles
app.get('/', (req, res) => {
    const routes = [
        { path: '/', description: 'Liste des routes disponibles' },
        { path: '/users', description: 'Liste de tous les utilisateurs' },
        { path: '/users/:id', description: 'Détails d\'un utilisateur spécifique' },
        { path: '/users/role/admin', description: 'Liste des administrateurs' },
        { path: '/users/role/user', description: 'Liste des utilisateurs standards' }
    ];
    res.json(routes);
});

// Route pour obtenir tous les utilisateurs
app.get('/users', (req, res) => {
    res.json(users);
});

// Route pour obtenir un utilisateur spécifique par ID
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
    }
});

// Route pour obtenir tous les administrateurs
app.get('/users/role/admin', (req, res) => {
    const admins = users.filter(user => user.role === "admin");
    res.json(admins);
});

// Route pour obtenir tous les utilisateurs standards
app.get('/users/role/user', (req, res) => {
    const normalUsers = users.filter(user => user.role === "user");
    res.json(normalUsers);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
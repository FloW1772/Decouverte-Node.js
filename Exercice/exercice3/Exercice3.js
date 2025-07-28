const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Pour parser les données POST
app.use(express.urlencoded({ extended: true }));

// Liste des utilisateurs en dur
const users = [
    { id: 1, name: "John Doe", role: "admin" },
    { id: 2, name: "Jane Smith", role: "user" },
    { id: 3, name: "Bob Wilson", role: "user" },
    { id: 4, name: "Alice Brown", role: "admin" },
];

// Middleware pour vérifier que le nom n'est pas vide
function checkUserName(req, res, next) {
    if (!req.body.name || req.body.name.trim() === '') {
        return res.status(400).render('error', { message: "Le nom de l'utilisateur ne peut pas être vide !" });
    }
    next();
}

// Route principale listant toutes les routes disponibles
app.get('/', (req, res) => {
    const routes = [
        { path: '/', description: 'Liste des routes disponibles' },
        { path: '/users', description: 'Liste de tous les utilisateurs' },
        { path: '/users/:id', description: 'Détails d\'un utilisateur spécifique' },
        { path: '/users/role/admin', description: 'Liste des administrateurs' },
        { path: '/users/role/user', description: 'Liste des utilisateurs standards' },
        { path: '/admin', description: 'Formulaire d\'ajout d\'utilisateur' }
    ];
    res.json(routes);
});

// Route pour afficher les utilisateurs avec EJS
app.get('/users', (req, res) => {
    res.render('users', { users });
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

// Route GET pour afficher le formulaire d'ajout d'utilisateur
app.get('/admin', (req, res) => {
    res.render('admin');
});

// Route POST pour ajouter un utilisateur (avec middleware de vérification)
app.post('/admin', checkUserName, (req, res) => {
    const { name, role } = req.body;
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push({ id, name, role });
    res.redirect('/users');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
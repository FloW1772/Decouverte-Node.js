const fs = require('fs');

// import fs from 'fs';

//méthode asynchrone pour lire un fichier
fs.readFile('file.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log('Erreur :', err);
        return;
    }
    console.log('Contenu du fichier : ');
    console.log(data);
});


//méthode synchrone pour lire un fichier
const data = fs.readFileSync('file.txt', 'utf-8');
console.log('Contenu du fichier : ');
console.log(data);

//écriture dans un fichier de maniere synchrone
fs.writeFileSync('fichier.txt', 'Bienvenue dans le monde de Node.js !', 'utf-8');
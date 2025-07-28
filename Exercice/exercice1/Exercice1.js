const os = require('os');

console.log('Nom du système d\'exploitation :', os.type());
console.log('Version du système d\'exploitation :', os.release());
console.log('Plateforme :', os.platform());
console.log('Endianisme :', os.endianness());
console.log('Mémoire totale (en Mo) :', (os.totalmem() / (1024 * 1024)).toFixed(2));
console.log('Architecture du processeur :', os.arch());
console.log('Nombre de processeurs logiques :', os.cpus().length);
console.log('Interfaces réseau disponibles :');
console.log(os.networkInterfaces());
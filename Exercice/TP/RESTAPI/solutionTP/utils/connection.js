const mongoose = require("mongoose");

const uri = 'mongodb://localhost:27017/express-brains';

async function connect() {
    mongoose.connect(uri).then(() => {
        console.log('Connexion réussie !');
    }).catch(error => console.log(error));
}

module.exports = {
    connect
}
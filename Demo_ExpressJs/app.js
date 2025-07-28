const express = require('express');
//initialisation d'expressJS
const app = express();

const port = 3000;
listCities = ['Paris', 'Lyon', 'Rennes', 'Nantes'];
user = {
    firstname: 'John',
    lastname: 'Doe'
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});


//Route global retournant le tableau de villes
app.get('/cities', (req, res) => {
    res.send(listCities);
    });

//Route retournant une ville en fonction de son id
app.get('/cities/:id', (req, res) => {
    let id = req.params.id;
    if (id > 0 && id <= listCities.length) {
        res.send(listCities[id-1]);
    } else {
        res.status(404).send('City not found');
    }
    });

app.get('/user', (req, res) => {
    res.json(user);
    });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
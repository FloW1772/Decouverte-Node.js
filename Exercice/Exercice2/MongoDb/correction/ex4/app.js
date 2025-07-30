const express = require('express');
const db = require('./queries');
const app = express();

app.get('/', async(req, res) => {
    const cities = await db.getAllCities();
    res.json(cities);
});

app.get('/name/:name', async(req, res) => {
    const cities = await db.getCityByName(req.params.name);
    res.json(cities);
});

app.get('/country/:country', async(req, res) => {
    const cities = await db.getCitiesByCountry(req.params.country);
    res.json(cities);
});

app.get('/addCity', async (req, res) => {
    const city1 = { name: 'Nantes', country: 'France', region: 'Pays de la Loire', description: 'Ville des ducs' };
    const city2 = { name: 'Brest', country: 'France', region: 'Bretagne', description: 'Ville pluvieuse' };
    const city3 = { name: 'Paris', country: 'France', region: 'Île de France', description: 'La capitale de la France' };

    await db.addCity(city1);
    await db.addCity(city2);
    await db.addCity(city3);
    res.send('Ville ajouté !');
});

app.get('/modifyCity', async(req, res) => {
    const oldCity = { name: 'Nantes', country: 'France', region: 'Pays de la Loire', description: 'Ville des ducs' };
    const newCity = { name: 'Nantes', country: 'France', region: 'Bretagne', description: 'Ville des ducs' };
    await db.modifyCity(oldCity, newCity);
    res.send('Ville modifiée !');
});

app.get('/delete/:name/:country', async (req, res) => {
    await db.deleteCity(req.params.name, req.params.country);
    res.json({
        msg: 'Ville supprimée !',
        name: req.params.name,
        country: req.params.country
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

const db = client.db('Cities');
client.connect().then(() => {
    console.log('Connexion réussi !');
}).catch(err => console.log(err));

async function getAllCities() {
    try {
        const collection = db.collection('cities');
        const data = await collection.find().toArray();
        return data;
    } catch (err) {
        console.log(err);
        await client.close();
    }
};

async function getCityByName(cityName) {
    try {
        const collection = db.collection('cities');
        const data = await collection.findOne({ name: cityName });
        return data;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

async function getCitiesByCountry(cityCountry) {
    try {
        const collection = db.collection('cities');
        const data = await collection.find({ country: cityCountry }).toArray();
        return data;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

async function addCity(city) {
    try {
        const collection = db.collection('cities');
        const result = await collection.insertOne(city);
        return result.insertedId;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

async function modifyCity(oldCity, newCity) {
    try {
        const collection = db.collection('cities');
        const result = await collection.updateOne(oldCity, { $set: newCity });
        return result.modifiedCount;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

async function deleteCity(cityName, cityCountry) {
    try {
        const collection = db.collection('cities');
        const result = await collection.deleteOne({ name: cityName, country: cityCountry });
        return result.deletedCount;
    } catch (err) {
        console.log(err);
        await client.close();
    }
}

module.exports = {
    getAllCities,
    getCitiesByCountry,
    getCityByName,
    addCity,
    modifyCity,
    deleteCity
}
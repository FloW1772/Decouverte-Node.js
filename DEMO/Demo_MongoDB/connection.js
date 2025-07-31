const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://localhost:27017/cities_app";
const client = new MongoClient(uri);
// Création ou sélection de la base de données "cities_app"
const db = client.db("students");

// Connexion à la base de données
client.connect().then(async () => {
    console.log('Connected successfully to server');
    // Création d'une collection
    db.createCollection('students');

    db.createCollection('users');
    // Suppression de la collection "users" : deux manières de procéder
    await db.dropCollection('users');
    // await db.collection('users').drop();

    // Sélection de la collection "students"
    const collection = db.collection('students');

    // Insertion d'un seul objet dans la collection
    await collection.insertOne({ firstname: 'Joe', lastname: 'Dalton' });

    // // Insertion de plusieurs entrées
    let result = await collection.insertMany([
        { user: 'admin', role: 'admin' },
        { firstname: 'Luke', lastname: 'Skywalker', father: 'Dark Vador' },
        { firstname: 'Titi', lastname: 'Loiso', city: 'Acme' },
        { firstname: 'Sylvestre', surname: 'Grosminet', city: 'Acme' },
        { name: 'George Abitbol', address: {
            num: 42,
            city: 'Nantes',
            zipcode: 44000
        }} 
    ]);
    console.log(result);
    console.log("Nombre de lignes insérées : " + result.insertedCount);

    // Sélection de tous les étudiants
    let students = await collection.find().toArray();
    students.forEach((s) => console.log(s));

    // Sélection des prénoms des 10 premiers étudiants d'Acme trié par nom de famille "croissant"
    let acmeStudents = await collection.find({ city: 'Acme' }).project({ _id: 0, firstname: 1 }).limit(10).sort({ firstname: 1 }).toArray();
    console.log('Affichage des étudiants à Acme : ');
    acmeStudents.forEach((s) => console.log(s));

    // Modification de tous les étudiants s'appelant George pour les mettre à l'ENI
    result = await collection.updateMany({ name: 'George Abitbol' }, { $set: { school: 'ENI Nantes' } });
    console.log(result);

    // Suppression d'une entrée ayant pour prénom "Luke"
    result = await collection.deleteOne({ firstname: 'Luke' });
    if (result.deleteCount > 0) {
        console.log('Suppression réussie !');
    }
})
.catch((err) => {
    console.log('Error connecting to server:', err);
});
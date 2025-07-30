const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Schéma + modèle AVANT la connexion
const villeSchema = new mongoose.Schema({
  nom: String,
  pays: String,
  région: String,
  description: String,
});
const Ville = mongoose.model('Ville', villeSchema);

// Connexion MongoDB + ajout automatique
mongoose.connect('mongodb://localhost:27017/villesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ Connecté à MongoDB");

  // ➕ Ajouter Paris si elle n'existe pas
  const existe = await Ville.findOne({ nom: "Paris", pays: "France" });
  if (!existe) {
    await Ville.create({
      nom: "Paris",
      pays: "France",
      région: "Île-de-France",
      description: "Capitale de la France",
    });
    console.log("🏙️ Ville 'Paris' ajoutée automatiquement");
  } else {
    console.log("ℹ️ Ville 'Paris' existe déjà");
  }
})
.catch((err) => console.error("❌ Erreur MongoDB :", err));

// ➕ Ajouter une ville manuellement
app.post('/villes', async (req, res) => {
  const ville = new Ville(req.body);
  await ville.save();
  res.send(ville);
});

// 📖 Lister toutes les villes
app.get('/villes', async (req, res) => {
  const villes = await Ville.find();
  res.send(villes);
});

// 🔍 Par pays
app.get('/villes/pays/:pays', async (req, res) => {
  const villes = await Ville.find({ pays: req.params.pays });
  res.send(villes);
});

// 🔍 Par nom
app.get('/villes/nom/:nom', async (req, res) => {
  const ville = await Ville.findOne({ nom: req.params.nom });
  res.send(ville);
});

// ✏️ Modifier une ville
app.put('/villes', async (req, res) => {
  const { nom, pays, update } = req.body;
  const ville = await Ville.findOneAndUpdate({ nom, pays }, update, { new: true });
  res.send(ville);
});

// ❌ Supprimer une ville
app.delete('/villes', async (req, res) => {
  const { nom, pays } = req.body;
  const result = await Ville.findOneAndDelete({ nom, pays });
  res.send(result);
});

// Démarrer le serveur
app.listen(3000, () => {
  console.log('🚀 Serveur démarré sur http://localhost:3000');
});

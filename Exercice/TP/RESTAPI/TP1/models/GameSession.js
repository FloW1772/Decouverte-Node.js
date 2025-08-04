const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  numberToFind: { type: Number, required: true },
  startedAt: { type: Date, required: true },
  finishedAt: Date,
  isFinished: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  timeSpent: { type: Number, default: 0 }
});

// Utilise ce pattern pour éviter l'erreur OverwriteModelError
module.exports = mongoose.models.GameSession || mongoose.model('GameSession', gameSessionSchema);

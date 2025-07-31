const mongoose = require('mongoose');

const RankSchema = mongoose.Schema({
    uuid: String,
    pseudo: String,
    attempt: String,
    time: Number,
    numberToFind: Number
});

const RankModel = mongoose.model('Rank', RankSchema);

module.exports = {
    RankModel
}
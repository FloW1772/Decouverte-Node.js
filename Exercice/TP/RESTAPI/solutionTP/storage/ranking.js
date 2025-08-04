const uuid = require('uuid')
const { RankModel } = require('../models/Rank');

async function addRank (pseudo, attempts, duration, numberToFind) {
  const newRank = new RankModel({
    uuid: uuid.v4(),
    pseudo: pseudo,
    attempt: attempts,
    time: duration,
    numberToFind: numberToFind
  });
  await newRank.save();
  return newRank;
}

async function getAllRanks () {
  const listRanks = await RankModel.find();
  return listRanks;
}

module.exports = {
    addRank,
    getAllRanks  
}

//model/Sentence.js
const mongoose = require('mongoose');

const sentenceSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sentence', sentenceSchema);

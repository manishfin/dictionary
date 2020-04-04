const mongoose = require('mongoose');

const word = new mongoose.Schema({
    word: String,
    start: String,
});

module.exports = Word = mongoose.model('Word', word);
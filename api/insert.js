'use strict';

const fs = require('fs');

const connectDB = require('../config/db/Connection');

connectDB();

const Word = require('../config/db/schemas/Word');

const rawdata = fs.readFileSync('api/words_dictionary.json');
const student = JSON.parse(rawdata);
// console.log(student);
// const wordsp = Object.keys(student).slice(110000, 111000);

Promise.all(Object.keys(student).slice(300000, 400000).map(async(word) => {
    const x = {
        word,
        start: word[0],
    };
    console.log(x);
    const y = new Word(x);
    await y.save();
}));
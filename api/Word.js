const express = require('express');
const Word = require('../config/db/schemas/Word');

const route = express.Router();

route.post('/add', async (req, res) => {
  const { word } = req.body;
  if (!word) return res.send('Error! Can not add empty word!');
  const dictWord = {
      word,
      start: word && word[0],
  };
  const wordInstance = new Word(dictWord);
  await wordInstance.save();
  res.json(wordInstance);
});

const shuffle = (array) => {
    for (let i = 0; i < array.length; i++) {
        const rand = Math.floor(Math.random() * (i+1));
        [array[i], array[rand]] = [array[rand], array[i]];
    }

    return array;
};

route.get('/', async (req, res) => {
    let { chars, count } = req.body;
    const maxWordCount = Number.isInteger(count) ? count : 100;
    if (!chars) chars = [];
    chars = chars.filter(char => char.toUpperCase() != char.toLowerCase()); // filter special chars
    chars = [...new Set(chars)]; // remove duplicate
    await Word.aggregate([
        { $group: { // group into matched and unmatched words
            _id: {
                $cond: [ { $in: ["$start", chars ] }, 1, 0]
            },
            words: { $push: "$word" },
        }},
    ], (err, groups) => {
        if (err) res.send('Error!');
        else {
            // take higher probability of getting matched data
            const matchWordCount = chars.length ? Math.floor((40 + chars.length * 60/26) * maxWordCount / 100) : 0;
            const data = groups.map((group) => {
                const words = shuffle(group.words);
                if (group.id) return words.slice(0, matchWordCount);
                return words.slice(0, maxWordCount - matchWordCount);
            });
            res.json(data.flat());
        };
    });
  });

module.exports = route;
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


const getMatchWords = (chars, count) => {
    return Promise.resolve(Word.aggregate([
        {
            $match: { $expr: { $in: ["$start", chars ] }}
        },
        {
            $sample: { size: count }
        },
    ], (err, matchDocs) => {
        if (err) return [];
        else return matchDocs;
    }));
}

const getUnMatchWords = (count) => {
    return Promise.resolve(Word.aggregate([
        {
            $sample: { size: count }
        },
    ], (err, unmatchDocs) => {
        if (err) return [];
        else return unmatchDocs;
    }));
}

const getRandom = (array, count) => {
    if (array.length <= count) return array;
    const result = [];
    const track = {};
    for(let i=0; i<count; i++) {
        const index = Math.floor(Math.random()*(i+1));
        if (!track[index]) {
            result.push(array[index]);
            track[index] = 1;
        }
        else {
            i -= 1;
        }
    }

    return result;
  };

route.get('/', (req, res) => {
    let { chars, count } = req.body;
    console.log(chars);
    const maxWordCount = Number.isInteger(count) ? count : 100;
    if (!chars) chars = [];
    chars = chars.filter(char => char.toUpperCase() != char.toLowerCase()); // filter special chars
    chars = [...new Set(chars)]; // remove duplicate
    const matchWordCount = chars.length ? Math.floor((40 + chars.length * 60/26) * maxWordCount / 100) : 0;
    return Promise.all([getMatchWords(chars, matchWordCount), getUnMatchWords(maxWordCount - matchWordCount)])
        .then((docs) => {
            // console.log(docs);
            const words1 = docs[0].map((doc) => doc.word);
            const words2 = docs[1].map((doc) => doc.word);
            const words = words1.concat(words2);
            // console.log(words);
            // console.log(shuffle(words, maxWordCount));
            res.json(shuffle(words, maxWordCount));
        });
  });

module.exports = route;
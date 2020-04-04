const express = require('express');

const Word = require('../api/Word');
const connectDB = require('../config/db/Connection');

const app = express();

connectDB();

app.use(express.json({ extended: false }));
app.use('/word', Word);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server started'));
const mongoose = require('mongoose');

const CONNECTION_URI ="mongodb+srv://dbUserManish:dbmanish@cluster0-jmjsd.mongodb.net/test?retryWrites=true&w=majority";

const connectMongoDB = () => {
  return mongoose.connect(CONNECTION_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
    .then(() => console.log('Mongo DB has been connected!'))
    .catch(() => console.log('Mongo db connection error!'));
};

module.exports = connectMongoDB;
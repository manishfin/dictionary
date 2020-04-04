const mongoose = require('mongoose');

const CONNECTION_URI ="mongodb+srv://dbUserManish:dbmanish@cluster0-jmjsd.mongodb.net/test?retryWrites=true&w=majority";

const connectMongoDB = async () => {
  await mongoose.connect(CONNECTION_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('Mongo DB has been connected!');
};

module.exports = connectMongoDB;
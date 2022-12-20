const mongoose = require("mongoose");

const config = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const connectDB = (url) => {
  return mongoose.connect(url, config);
};

module.exports = connectDB;

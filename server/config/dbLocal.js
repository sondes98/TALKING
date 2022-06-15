const mongoose = require("mongoose");
var Fawn = require("fawn");

const connectDB = async () => {
  try {
    mongoose.connect(
      process.env.URI,
      // "mongodb://127.0.0.1:27017/testDB"
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database connected");
  } catch (error) {
    console.error("Connection to databse failed", error);
  }
  Fawn.init(mongoose);
};
module.exports = connectDB;

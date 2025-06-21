const mongoose = require("mongoose");

// This function connects to the MongoDB database using Mongoose.
// It uses the connection string stored in the environment variable DB_CONNECTION_SECRET.
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;

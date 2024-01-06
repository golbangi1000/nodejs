const { MongoClient } = require("mongodb");
// require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

let connectDB = new MongoClient(MONGO_URL).connect();

module.exports = connectDB;

const mysql = require("mysql");
const env = require("dotenv");

env.config();
const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

database.connect((err, results) => {
  if (err) {
    console.log("Technical issues.");
  } else {
    console.log("Succesfully connected database.");
  }
});

module.exports = database;

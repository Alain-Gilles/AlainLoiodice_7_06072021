const dotenv = require("dotenv");
const dbConfig = require("../config/db.config.js");
var mysql = require("mysql");
const nomBase = dbConfig.DB;
let creationBase = false;
const creatDB = "CREATE DATABASE IF NOT EXISTS " + nomBase + ";";
var connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
});
connection.connect(function (error) {
  if (!error) {
    console.error("Et 1 La connexion à MySQL a réussie !");
    connection.query(creatDB, function (error) {
      if (error) {
        console.log("creatDB", creatDB);
        console.error("La création de la BD a échoué !");
      } else {
        console.log("creation de la BD !");
        creationBase = true;
      }
    });
  } else {
    console.log("Et 2 Connexion à MySQL a échoué  !");
  }
});

module.exports = creationBase;

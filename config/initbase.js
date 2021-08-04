const mysql = require("mysql");
const nomBase = dbConfig.DB;
const creatDB = "CREATE DATABASE " + nomBase;

const db = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connecté à la base de données MySQL!");
  db.query(creatDB, function (err, result) {
    if (err) throw err;
    console.log("Base de données créée !");
  });
});

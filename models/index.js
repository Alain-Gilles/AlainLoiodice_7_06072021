const dbConfig = require("../config/db.config.js");

//////////////////////////////////////////////////////
// Creation de la base de données si elle n'existe pas
//
const mysql = require("mysql");
const nomBase = dbConfig.DB;
const creatDB = "CREATE DATABASE IF NOT EXISTS " + nomBase;

const dbinit = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
});

dbinit.connect(function (err) {
  if (err) throw err;
  console.log("1 Connecté à la base de données MySQL!");
  dbinit.query(creatDB, function (err, result) {
    if (err) throw err;
    console.log("2 Base de données créée !");
  });
});
//
////////////////////////////////////////////////

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User.js")(sequelize, Sequelize);
db.messages = require("./Message.js")(sequelize, Sequelize);
db.comments = require("./Comment.js")(sequelize, Sequelize);
db.likedislikes = require("./Likedislike.js")(sequelize, Sequelize);

db.users.hasMany(db.messages, { as: "messages" }, { onDelete: "cascade" });
db.messages.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.users.hasMany(db.comments, { as: "comments" }, { onDelete: "cascade" });
db.comments.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.users.hasMany(
  db.likedislikes,
  { as: "likedislikes" },
  { onDelete: "cascade" }
);
db.likedislikes.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.messages.hasMany(db.comments, { as: "comments" }, { onDelete: "cascade" });
db.comments.belongsTo(db.messages, {
  foreignKey: "messageId",
  as: "message",
});

db.messages.hasMany(
  db.likedislikes,
  { as: "likedislikes" },
  { onDelete: "cascade" }
);
db.likedislikes.belongsTo(db.messages, {
  foreignKey: "messageId",
  as: "message",
});

module.exports = db;

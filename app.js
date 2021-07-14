const express = require("express");

const helmet = require("helmet");

const app = express();

require("dotenv").config({ path: "./config/.env" });

const path = require("path");

const userRoutes = require("./routes/User");

const gestuserRoutes = require("./routes/Gestuser");

const messageRoute = require("./routes/Message");

const commentRoute = require("./routes/Comment");

const likedislikeRoute = require("./routes/Likedislike");

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();

app.use("/api/auth", userRoutes);

app.use("/api/gestion", gestuserRoutes);

app.use("/api/mess", messageRoute);

app.use("/api/comm", commentRoute);

app.use("/api/likedislike", likedislikeRoute);

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));
//
//  CORS
//
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

module.exports = app;

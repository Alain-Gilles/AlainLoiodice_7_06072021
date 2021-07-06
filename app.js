const express = require("express");

const helmet = require("helmet");

const app = express();

require("dotenv").config({ path: "./config/.env" });

const userRoutes = require("./routes/User");

const messageRoute = require("./routes/Message");

const commentRoute = require("./routes/Comment");

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();

app.use("/api/auth", userRoutes);

app.use("/api/mess", messageRoute);

app.use("/api/comm", commentRoute);

module.exports = app;

const db = require("../models");
const User = db.users;
const Message = db.messages;

// Create and Save a new User
exports.signup = (req, res) => {
  // Validate request
  console.log("req.body", req.body);
  if (!req.body.username) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a User
  const user = {
    username: req.body.username,
    speudo: req.body.speudo,
    isAdmin: 0,
    password: req.body.password,
    avatar: req.body.avatar,
  };

  // Save Post in the database
  User.create(user)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

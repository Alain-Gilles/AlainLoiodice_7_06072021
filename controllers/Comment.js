const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;

// Create and Save a new Comment
exports.createComment = (req, res) => {
  // Validate request
  console.log("req.body", req.body);
  if (!req.body.content) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Comment
  const comment = {
    content: req.body.content,
    userId: req.body.userId,
    messageId: req.body.messageId,
  };

  // Save Post in the database
  Comment.create(comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

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
        message:
          err.message || "Some error occurred while creating the Comment.",
      });
    });
};
// Modifier un commentaire
//
//router.put("/:commentID", commentCtrl.modifyComment);
//
exports.modifyComment = (req, res) => {
  // Validate request
  if (!req.body.content) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Données de Comment à updater
  const majComment = {
    content: req.body.content,
  };

  //Update Comment in the database
  Comment.update(majComment, {
    where: { id: req.params.commentID },
  })
    .then((data) => {
      if (data[0] == 0) {
        console.log("Mise à jour impossible");
        res.status(500).send({
          message:
            "Some error occurred while retrieving Comment. Mise à jour impossible",
        });
      } else {
        console.log("mise à jour effectuée");
        res.send({ Majsucces: true, nbreEnrMaj: data });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while modify Comment.",
      });
    });
};

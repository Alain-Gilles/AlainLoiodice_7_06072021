const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;

//
// Creer un nouveau commentaire pour un message
//
//router.post("/", commentCtrl.createComment);
//
exports.createComment = (req, res, next) => {
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
//
// Modifier un commentaire
//
//router.put("/:commentID", commentCtrl.modifyComment);
//
exports.modifyComment = (req, res, next) => {
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
//
// Supprimer un commentaire
//
//router.delete("/:commentID", commentCtrl.deleteComment);
//
exports.deleteComment = async (req, res, next) => {
  let commentId = req.params.commentID;
  let comment = await Comment.findByPk(commentId);
  console.log("comment", comment);
  if (!comment) {
    res.status(404).send({
      message: "Does Not exist a Comment with id = " + commentId,
    });
  } else {
    await comment.destroy();
    res.status(200).send({
      message: "Delete Successfully a Comment with id = " + commentId,
    });
  }
};
//
// Afficher un commentaire
//
//router.get("/:commentID", commentCtrl.getOneComment);
//
// La methode findByPk n'obtient qu'une seule entrée de la table, à l'aide de la clé primaire fournie.
//
exports.getOneComment = (req, res, next) => {
  _commentID = req.params.commentID;

  Comment.findByPk(_commentID)
    .then((data) => {
      if (data === null) {
        res.status(500).send({
          message: "Some error occurred while retrieving Comment.",
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Comment.",
      });
    });
};

const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;

//
// Creer un nouveau commentaire pour un message
//
//router.post("/", commentCtrl.createComment);
//
exports.createComment = async (req, res, next) => {
  //
  // Validate request
  //
  console.log("req.body", req.body);

  if (!req.body.content) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  if (!req.body.userId) {
    res.status(400).send({
      message: "UserId can not be empty!",
    });
    return;
  }

  if (!req.body.messageId) {
    res.status(400).send({
      message: "MessageId can not be empty!",
    });
    return;
  }
  //
  // Le message auquel se rattache le commentaire doit exister
  //
  let message = await Message.findByPk(req.body.messageId);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.body.messageId,
    });
    return;
  }
  //
  // L'utilisateur qui créait le commentaire doit exister
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
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
exports.modifyComment = async (req, res, next) => {
  //
  // Validate request
  //
  var _commentID = req.params.commentID;
  console.log("_commentID", _commentID);

  //
  // vérification que le commentaire existe bien
  //
  let comment = await Comment.findByPk(_commentID);
  if (!comment) {
    {
      res.status(400).send({
        message: "Does Not exist a comment with id = " + _commentID,
      });
      return;
    }
  }
  //
  // vérification que req.body contient bien id de l'utilisateur connecté
  // présence de req.body.utilisateurID
  //
  if (!req.body.utilisateurID) {
    res.status(400).send({
      message:
        "L'iD de l'utilisateur connecté doit être renseigne dans body.utilisateurID",
    });
    return;
  }
  let _userID = req.body.utilisateurID;
  //
  // verification que l'utilisateur existe
  //
  let user = await User.findByPk(_userID);
  if (!user) {
    {
      res.status(400).send({
        message: "Does Not exist a User with id = " + _userID,
      });
      return;
    }
  }
  //
  //  content ne doit pas être vide
  //
  if (!req.body.content) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  //
  // verification que l'utilisateur connecté est le créateur du commentaire ou l'administrateur si ce n'est pas le cas erreur
  //
  if (!(comment.userId == _userID || user.isAdmin)) {
    res.status(400).send({
      message:
        "Only Administrator or the user who create the comment can modify it, connect user = " +
        _userID +
        " user who create comment : " +
        comment.userId,
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
  let _commentId = req.params.commentID;
  //
  // vérification que le commentaire existe bien
  //
  let comment = await Comment.findByPk(_commentId);
  if (!comment) {
    {
      res.status(400).send({
        message: "Does Not exist a comment with id = " + _commentId,
      });
      return;
    }
  }

  //
  // vérification que req.body contient bien id de l'utilisateur connecté
  // présence de req.body.utilisateurID
  //
  if (!req.body.utilisateurID) {
    res.status(400).send({
      message:
        "L'iD de l'utilisateur connecté doit être renseigne dans body.utilisateurID",
    });
    return;
  }
  let _userID = req.body.utilisateurID;
  //
  // verification que l'utilisateur existe
  //
  let user = await User.findByPk(_userID);
  if (!user) {
    {
      res.status(400).send({
        message: "Does Not exist a User with id = " + _userID,
      });
      return;
    }
  }
  //
  // verification que l'utilisateur connecté est le créateur du commentaire ou l'administrateur si ce n'est pas le cas erreur
  //
  if (!(comment.userId == _userID || user.isAdmin)) {
    res.status(400).send({
      message:
        "Only Administrator or the user who create the comment can delete it, connect user = " +
        _userID +
        " user who create comment : " +
        comment.userId,
    });
    return;
  }
  //
  // suppression du message
  //
  await comment.destroy({ where: { id: _commentId } });
  res.status(200).send({
    message: "Delete Successfully a Comment with id = " + _commentId,
  });
};
//
// Afficher un commentaire
//
//router.get("/:commentID", commentCtrl.getOneComment);
//
// La methode findByPk n'obtient qu'une seule entrée de la table, à l'aide de la clé primaire fournie.
//
exports.getOneComment = async (req, res, next) => {
  _commentID = req.params.commentID;

  Comment.findByPk(_commentID)
    .then((data) => {
      if (data === null) {
        res.status(400).send({
          message: "Does Not exist a Comment with commentID = " + _commentID,
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

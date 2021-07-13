const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;
const fs = require("fs");

// Create and Save a new Message
exports.createMessage = async (req, res, next) => {
  console.log("req.body", req.body);
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "title can not be empty!!!",
    });
    return;
  }
  if (!req.body.content) {
    res.status(400).send({
      message: "content can not be empty!",
    });
    return;
  }
  if (!req.body.objet) {
    res.status(400).send({
      message: "objet can not be empty!",
    });
    return;
  }
  if (!req.body.userId) {
    res.status(400).send({
      message: "user can not be empty!",
    });
    return;
  }
  //
  // L'utilisateur doit exister sinon erreur
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
    });
    return;
  }
  // Create a Message
  const message = {
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    objet: req.body.objet,
    userId: req.body.userId,
  };

  // Save Message in the database
  Message.create(message)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

//
// Get all Messages
//
exports.getAllMessage = async (req, res, next) => {
  //
  // l'Id de l'utilisateur connecté est obligatoire
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "user can not be empty!",
    });
    return;
  }
  //
  // L'utilisateur doit exister sinon erreur
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
    });
    return;
  }
  Message.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Message.",
      });
    });
};
//
// Get One Messages
// La methode findByPk n'obtient qu'une seule entrée de la table, à l'aide de la clé primaire fournie.
//
exports.getOneMessage = async (req, res, next) => {
  _messageID = req.params.messageID;
  //
  // l'Id de l'utilisateur connecté est obligatoire
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "user can not be empty!",
    });
    return;
  }
  //
  // L'utilisateur doit exister sinon erreur
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
    });
    return;
  }

  Message.findByPk(_messageID)
    .then((data) => {
      if (data === null) {
        res.status(500).send({
          message: "Le message n'a pas été trouvé.....",
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Message.",
      });
    });
};
//
// Modifier un message
//
//router.put("/:messageID", messageCtrl.modifyMessage);
// req.params.id   (id du message à modifier /:messageID de la route)
// req.body.utilisateurID   (utilisateur connecté qui souhaite modifier le message)
//
// req.body.title
// req.body.content
// req.body.imgUrl
// req.body.objet
//
// Seul l'utilisateur qui a créé le message peut le modifier ou l'utilisateur doit être Administrateur isAdmin = true
//
exports.modifyMessage = async (req, res, next) => {
  //
  // Validate request
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "userId : user connected can not be empty!",
    });
    return;
  }
  if (
    !(req.body.title || req.body.content || req.body.imgUrl || req.body.objet)
  ) {
    res.status(400).send({
      message: "Must be some thing to update !",
    });
    return;
  }

  _userID = req.body.userId;

  // Données de Message à updater
  const majMessage = {
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    objet: req.body.objet,
  };

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
  // Vérification que le message existe
  //
  let message = await Message.findByPk(req.params.messageID);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.params.messageID,
    });
    return;
  }
  //
  // verification que l'utilisateur connecté est le créateur du message ou l'administrateur si ce n'est pas le cas erreur
  //
  if (!(message.userId == _userID || user.isAdmin)) {
    res.status(400).send({
      message:
        "Only Administrator or the user who create the message can modify it, connect user = " +
        _userID +
        " user who create message : " +
        message.userId,
    });
    return;
  }
  //
  // Update Message in the database
  //
  Message.update(majMessage, {
    where: { id: req.params.messageID },
  })
    .then((data) => {
      if (data[0] == 0) {
        console.log("Mise à jour impossible");
        res.status(500).send({
          message:
            "Some error occurred while retrieving Message. Mise à jour impossible",
        });
      } else {
        console.log("mise à jour effectuée");
        res.send({ Majsucces: true, nbreEnrMaj: data });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

//
// Supprimer un message
//
//router.delete("/:messageID", messageCtrl.deleteMessage);
//
// req.params.messageID contient le numéro ID du message à supprimer
// req.body.utilisateurID   (utilisateur connecté qui souhaite modifier le message)
//
exports.deleteMessage = async (req, res, next) => {
  ///
  var messageId = req.params.messageID;
  var _userID = req.body.userId;
  //
  // Le message à supprimer doit exister
  //
  let message = await Message.findByPk(messageId);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.params.messageID,
    });
    return;
  }
  //
  // verification que l'utilisateur connecté doit exister
  //
  let user = await User.findByPk(_userID);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + _userID,
    });
    return;
  }
  //
  // Seul le créateur du message ou l'administrateur peuvent le supprimer
  //

  if (!(message.userId == _userID || user.isAdmin)) {
    res.status(400).send({
      message:
        "Only Administrator or the user who create the message can modify it, connect user = " +
        _userID +
        " user who create message : " +
        message.userId,
    });
    return;
  }

  //
  // suppression du message
  //
  await message.destroy({ where: { id: messageId } });
  res.status(200).send({
    message: "Delete Successfully a Message with id = " + messageId,
  });
};
//
// Afficher tous les commentaires d'un message
//
//router.get("/comm/:messageId", messageCtrl.getAllCommFromMessage);
//
exports.getAllCommFromMessage = async (req, res, next) => {
  let messId = req.params.messageID;
  console.log("messId", messId);

  let message = await Message.findByPk(messId);
  console.log("message", message);
  if (!message) {
    res.status(404).send({
      message: "Does Not exist a Message with id = " + messId,
    });
  } else {
    var condition = {
      where: {
        messageID: messId,
      },
    };
    console.log("condition", condition);
    Comment.findAll(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Message.",
        });
      });
  }
};

const db = require("../models");
const Message = db.messages;
const User = db.users;

// Create and Save a new Message
exports.createMessage = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Message
  const message = {
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    objet: req.body.objet,
    nbLike: 0,
    nbUnlike: 0,
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
exports.getAllMessage = (req, res) => {
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
exports.getOneMessage = (req, res) => {
  _messageID = req.params.messageID;

  Message.findByPk(_messageID)
    .then((data) => {
      if (data === null) {
        res.status(500).send({
          message: "Some error occurred while retrieving Message.",
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
//
exports.modifyMessage = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Données de Message à updater
  const majMessage = {
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    objet: req.body.objet,
  };

  //Update Message in the database
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

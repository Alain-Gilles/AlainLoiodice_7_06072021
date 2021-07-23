const { Sequelize } = require("../models");
const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;
const Likedislike = db.likedislikes;
//
// Creer un liked ou un disliked pour un message par un user
// req.body.userId   utilisateur qui veut liker ou disliker
// req.body.messageID  message à liker ou disliker
// req.body.action   contient 1 pour liked 2 pour disliked 0 pour défaire le liked ou le disliked
//
exports.createLikedislike = async (req, res, next) => {
  //
  // req.body.messageID l'Id du message sur lequel on emet un avis
  // req.body.userId id du user connecté
  //
  console.log("req.body", req.body);
  _messageID = req.body.messageID;
  _userID = req.body.userId;
  _action = req.body.action;
  //
  // Vérification que le user existe
  //
  let user = await User.findByPk(_userID);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + _userID,
    });
    return;
  }
  //
  // Vérification que le message existe
  //
  let message = await Message.findByPk(_messageID);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + _messageID,
    });
    return;
  }
  //
  // Un code action doit etre défini il doit être égal à 0 (pour défaire) 1 (pour liker) ou 2 (pour disliker)
  //
  if (!(_action == 0) && !(_action == 1) && !(_action == 2)) {
    res.status(400).send({
      message:
        "Code action doit être égal à 0 pour défaire, 1 pour licker, 2 pour disliker ici code action  = " +
        _action,
    });
    return;
  }
  // Vérification existance d'un enregistrement dans la table likedislikes pour un message et un user donné
  //
  console.log("_userID", _userID, " _messageID", _messageID);
  let likedislike = await Likedislike.findOne({
    where: { userId: _userID, messageId: _messageID },
  });
  if (!likedislike) {
    //
    // il n'y a pas de liked ou disliked pour le couple message utilisateur
    // on va donc créer un liked ou un disliked mais si si req.body.action = 0 on ne fait rien , on ne peut pas défaire un avis alors qu'il n'exite pas
    // d'avis pour le couple message user
    //
    if (!(_action == 1 || _action == 2)) {
      res.status(400).send({
        message:
          "You can't unliked or undisliked for for this messageID  " +
          _messageID +
          "  and this userID  " +
          _userID +
          "  because you aven't liked or disliked before",
      });
      return;
    }
    // _action = 1 ou _action = 2 => création d'un liked ou disliked
    else {
      //************** */
      let avislike = 0;
      let avisdislike = 0;
      if (_action == 1) {
        avislike = 1;
      } else {
        avisdislike = 1;
      }
      // Create a likedislike
      const likedislike = {
        liked: avislike,
        disliked: avisdislike,
        unavis: 1,
        userId: _userID,
        messageId: _messageID,
      };

      // Save Likedislike in the database
      Likedislike.create(likedislike)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating likedislike.",
          });
        });

      //************* */
    }
  } else {
    //
    // unliked ou un disliked existe pour le couple message user
    //
    // Sauvegarde du numéro de id du liked disliked
    //
    let sauvID = likedislike.id;
    //
    console.log("sauvID", sauvID);
    //
    // Si unavis = 1 => un liked ou un disliked existe pour le couple message user
    //
    if (likedislike.unavis == 1) {
      //
      // si _action <> 0 (rappel action = 1 liked, 2 disliked , 0 pour défaire ) un avis a déjé été émis
      //
      if (!_action == 0) {
        res.status(400).send({
          message:
            "You can't liked or unliked for for this messageID you have already do it   ",
        });
        return;
      }
    }
    //
    // Si _action = 0  mise à jour de la table likedislike en mettant 0 dans liked 0 dans disliked et 0 dans unavis
    //
    if (_action == 0) {
      ////////////////////
      // Données de Message à updater
      let majLikedislike = {
        liked: 0,
        disliked: 0,
        unavis: 0,
      };
      //
      //Update Message in the database
      //
      Likedislike.update(majLikedislike, {
        where: { id: sauvID },
      })
        .then((data) => {
          if (data[0] == 0) {
            console.log("Mise à jour impossible");
            res.status(500).send({
              message:
                "Some error occurred while retrieving Likedislike. Mise à jour impossible",
            });
          } else {
            console.log("mise à jour de votre avis effectuée ");
            res.send({ Majsucces: true, nbreEnrMaj: data });
          }
        })

        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
      ///////////////////
    } else {
      //
      // si (_action = 1 ou _action = 2) mise à jour de la table likedislikes
      //
      ////////////////////
      // Données de Message à updater
      //
      if (_action == 1) {
        vlike = 1;
        vdislike = 0;
      } else {
        vlike = 0;
        vdislike = 1;
      }
      majLikedislike = {
        liked: vlike,
        disliked: vdislike,
        unavis: 1,
      };
      //
      //Update Message in the database
      //
      Likedislike.update(majLikedislike, {
        where: { id: sauvID },
      })
        .then((data) => {
          if (data[0] == 0) {
            console.log("Mise à jour impossible");
            res.status(500).send({
              message:
                "Some error occurred while retrieving Likedislike. Mise à jour impossible",
            });
          } else {
            console.log("mise à jour de votre avis effectuée ");
            res.send({ Majsucces: true, nbreEnrMaj: data });
          }
        })

        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
      ///////////////////
    }
  }
  //
  //********
};
//
// Enlever un liked ou le disliked d'un message (uniquement si l'utilisateur qui veut supprimer a créé le liked ou disliked pour ce message)
// req.body.userId  contient ID du user connecté
// req.body.messageID contient ID du message
// req.body.likeID contient ID du liked
//
exports.deleteLikedislike = async (req, res, next) => {
  //
  _messageID = req.body.messageID;
  _userID = req.body.userId;
  //
  // Vérification que req.body.messageID est renseigné
  //
  if (!req.body.messageID) {
    res.status(400).send({
      message: "messageID doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que req.body.userId est renseigné
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "userId doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que le message existe
  //
  let message = await Message.findByPk(req.body.messageID);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.body.messageID,
    });
    return;
  }
  //
  // Vérification que le likedislike existe pour le couple userId messageId
  //
  let likedislike = await Likedislike.findOne({
    where: { userId: req.body.userId, messageId: req.body.messageID },
  });
  if (!likedislike) {
    res.status(400).send({
      message:
        "Does Not exist a likedislike with userId =   " +
        req.body.userId +
        "  messageId =  " +
        req.body.messageID,
    });
    return;
  }
  //
  // L'utilisateur qui a créé le liked doit-être l'utilisateur connecté pour pouvoir le supprimer
  //
  if (!(likedislike.userId == req.body.userId)) {
    res.status(400).send({
      message:
        "Only user who create likedislike can delete it. User who create liked disliked :  " +
        likedislike.userId +
        "  user connected  : " +
        req.body.userId,
    });
    return;
  }
  //
  //
  // sauvegarde de ID de la table likedislike
  //
  let sauvID = likedislike.id;
  //
  // Mise à jour de la table likedislike pour le couple user / message en mettant à zéro le liked , le disliked ainsi que 0 dans  unavis
  //
  let majLikedislike = {
    liked: 0,
    disliked: 0,
    unavis: 0,
  };
  //
  //Update Message in the database
  //
  Likedislike.update(majLikedislike, {
    where: { id: sauvID },
  })
    .then((data) => {
      if (data[0] == 0) {
        console.log("Mise à jour impossible");
        res.status(500).send({
          message:
            "Some error occurred while retrieving Likedislike. Mise à jour impossible",
        });
      } else {
        console.log("suppression de votre avis effectué ");
        res.send({ Suppsucces: true, nbreEnrMaj: data });
      }
    })

    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
  //
  //
};
//
// Afficher tous les likes ou dislikes pour un message
// req.body.messageID  getAllLikedislike
//
exports.getAllLikedislike = async (req, res, next) => {
  //
  // Vérification que req.body.userId est renseigné
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "userID doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que le user existe
  //
  let user = await User.findByPk(req.body.userId);
  if (!user) {
    res.status(400).send({
      message: "Does Not exist a User with id = " + req.body.userId,
    });
    return;
  }
  //
  // Vérification que req.body.messageID est renseigné
  //
  if (!req.body.messageID) {
    res.status(400).send({
      message: "messageID doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que le message existe
  //
  let message = await Message.findByPk(req.body.messageID);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.body.messageID,
    });
    return;
  }
  //
  // Somme du nombre de like et du nombre de dislike pour les enregistrements de la table
  // likedislikes dont le numéro de message passé dans la requete correspond au numeo de message
  // dans la table likedislike
  //
  Likedislike.findAll({
    where: { messageId: req.body.messageID },
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("liked")), "nbLike"],
      [Sequelize.fn("sum", Sequelize.col("disliked")), "nbDisLike"],
    ],
    //raw: true,
  })
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
// Afficher le like ou dislike d'un utilisateur pour un message
// req.body.userId
// req.body.messageID
//
exports.getUsermessLike = async (req, res, next) => {
  //
  // Vérification que req.body.messageID est renseigné
  //
  if (!req.body.messageID) {
    res.status(400).send({
      message: "messageID doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que req.body.userId est renseigné
  //
  if (!req.body.userId) {
    res.status(400).send({
      message: "userID doit-être renseigné !",
    });
    return;
  }
  //
  // Vérification que le message existe
  //
  let message = await Message.findByPk(req.body.messageID);
  if (!message) {
    res.status(400).send({
      message: "Does Not exist a Message with id = " + req.body.messageID,
    });
    return;
  }
  //
  // existe t-il un likedislike pour le couple req.body.messageID / req.body.userId
  let likedislike = await Likedislike.findOne({
    where: { userId: req.body.userId, messageId: req.body.messageID },
  });
  if (!likedislike) {
    res.status(400).send({
      message:
        "Pas de likedislike pour le couple userID : " +
        req.body.userId +
        "   messageID  :  " +
        req.body.messageID,
    });
    return;
  }
  class Nbrelikedislike {
    constructor(user, message, liked, disliked) {
      (this.user = user), (this.message = message), (this.liked = liked);
      this.disliked = disliked;
    }
  }
  console.log("likedislike.unavis  :  ", likedislike.unavis);
  if (likedislike.unavis == 0) {
    var Nbrelikedislike1 = new Nbrelikedislike(
      req.body.userId,
      req.body.messageID,
      0,
      0
    );
    console.log("Nbrelikedislike1  :  ", Nbrelikedislike1);
    res.status(200).send(Nbrelikedislike1);
    return;
  }
  var Nbrelikedislike2 = new Nbrelikedislike(
    req.body.userId,
    req.body.messageID,
    likedislike.liked,
    likedislike.disliked
  );
  res.status(200).send(Nbrelikedislike2);
  return;
};
//

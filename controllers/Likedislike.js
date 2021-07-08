const db = require("../models");
const Message = db.messages;
const User = db.users;
const Comment = db.comments;
const Likedislike = db.likedislikes;
//
// Creer un like ou un dislike pour un message par un user
// req.body.userID   utilisateur qui veut liker ou disliker
// req.body.messageID  message à liker ou disliker
// req.body.action   contient 1 pour like 2 pour dislike 0 pour défaire le like ou le dislike
//
exports.createLikedislike = async (req, res, next) => {
  //
  //********
  //
  console.log("req.body", req.body);
  _messageID = req.body.messageID;
  _userID = req.body.userID;
  _action = req.body.action;
  //
  // Vérification que le user existe
  //
  let user = await User.findByPk(_userID);
  if (!user) {
    try {
      throw "Does Not exist a User with id = " + _userID;
    } catch (error) {
      res.status(400).send({ error });
    }
  }
  console.log("user", user);
  //
  // Vérification que le message existe
  //
  let message = await Message.findByPk(_messageID);
  if (!message) {
    try {
      throw "Does Not exist a Message with id = " + _messageID;
    } catch (error) {
      res.status(400).send({ error });
    }
  }
  console.log("message", message);
  console.log("message.title", message.title);
  //
  // Vérification existance d'un enregistrement dans la table likedislikes pour un message et un user donné
  //
  console.log("_userID", _userID, " _messageID", _messageID);
  let likedislike = await Likedislike.findOne({
    where: { userId: _userID, messageID: _messageID },
  });
  if (!likedislike) {
    //
    // il n'y a pas de like ou dislike pour le couple message utilisateur
    // on va donc créer un like ou un dislike mais si si req.body.action = 0 on ne fait rien , on ne peut pas défaire un avis alors qu'il n'exite pas
    // d'avis pour le couple message user
    //
    if (!(_action == 1 || _action == 2)) {
      try {
        throw (
          "You can't unlike or undislike for for this messageID  " +
          _messageID +
          "  and this userID  " +
          _userID +
          "  because you aven't like or dislike before"
        );
      } catch (error) {
        res.status(400).send({ error });
      }
    }
    // _action = 1 ou _action = 2 => création d'un like ou dislike
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
        like: avislike,
        dislike: avisdislike,
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
    // unlike ou un dislike existe pour le couple message user
    //
    // Sauvegarde du numéro de id du like dislike
    //
    let sauvID = likedislike.id;
    //
    console.log("sauvID", sauvID);
    //
    // Si unavis = 1 => un like ou un dislike existe pour le couple message user
    //
    if (likedislike.unavis == 1) {
      //
      // si _action <> 0 (rappel action = 1 like, 2 dislike , 0 pour défaire ) un avis a déjé été émis
      //
      if (!_action == 0) {
        try {
          throw "You can't like or unlike for for this messageID you have already do it  ";
        } catch (error) {
          res.status(400).send({ error });
        }
      }
    }
    //
    // Si _action = 0  mise à jour de la table likedislike en mettant 0 dans like 0 dans dislike et 0 dans unavis
    //
    if (_action == 0) {
      ////////////////////
      // Données de Message à updater
      let majLikedislike = {
        like: 0,
        dislike: 0,
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
        like: vlike,
        dislike: vdislike,
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
// Enlever un like ou le dislike d'un message (uniquement si l'utilisateur qui veut supprimer a créé le like ou dislike pour ce message)
// req.body.userID
// req.body.messageID
//
exports.deleteLikedislike = async (req, res, next) => {
  //
  console.log("req.body", req.body);
  _messageID = req.body.messageID;
  _userID = req.body.userID;
  //
  // Vérification que le likedislike existe
  //
  let likedislike = await Likedislike.findOne({
    where: { userId: _userID, messageId: _messageID },
  });
  if (!likedislike) {
    try {
      throw (
        "Does Not exist a likedislike with messageID = " +
        _messageID +
        "  and userID = " +
        _userID
      );
    } catch (error) {
      res.status(400).send({ error });
    }
  }
  //
  // sauvegarde de ID de la table likedislike
  //
  let sauvID = likedislike.id;
  //
  // Le user doit-etre le créateur du message
  //
  if (!_userID == likedislike.userId) {
    try {
      throw (
        "Le créateur du message est  = " +
        likedislike.userId +
        "  l'utilisateur qui veut le supprimer = " +
        _userID
      );
    } catch (error) {
      res.status(400).send({ error });
    }
  }
  //
  // Mise à jour de la table likedislike pour le couple user / message en mettant à zéro le like , le dislike ainsi que 0 dans  unavis
  //
  let majLikedislike = {
    like: 0,
    dislike: 0,
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
// req.body.messageID
//
exports.getAllLikedislike = (req, res, next) => {};
//
// Afficher le like ou dislike d'un utilisateur pour un message
// req.body.userID
// req.body.messageID
//
exports.getUsermessLike = (req, res, next) => {};
//

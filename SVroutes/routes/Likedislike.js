const express = require("express");
const router = express.Router();
const likedislikeCtrl = require("../controllers/Likedislike");
const auth = require("../middleware/auth");
//
// Creer un like ou un dislike pour un message
//
router.post("/", auth, likedislikeCtrl.createLikedislike);
//
// Enlever un like ou le dislike d'un message (uniquement si l'utilisateur qui veut supprimer à créé le like ou dislike pour ce message)
//
router.delete("/", auth, likedislikeCtrl.deleteLikedislike);
//
// Afficher le nombre de like et de dislike  pour un message
//
router.get("/", auth, likedislikeCtrl.getAllLikedislike);
//
// Afficher le nombre de like et de dislike d'un utilisateur pour un message
//
router.get("/user", auth, likedislikeCtrl.getUsermessLike);
//
module.exports = router;

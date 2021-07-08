const express = require("express");
const router = express.Router();
const likedislikeCtrl = require("../controllers/Likedislike");
//
// Creer un like ou un dislike pour un message
//
router.post("/", likedislikeCtrl.createLikedislike);
//
// Enlever un like ou le dislike d'un message (uniquement si l'utilisateur qui veut supprimer à créé le like ou dislike pour ce message)
//
router.delete("/", likedislikeCtrl.deleteLikedislike);
//
// Afficher tous les likes ou dislikes pour un message
//
router.get("/", likedislikeCtrl.getAllLikedislike);
//
// Afficher le like ou dislike d'un utilisateur pour un message
//
router.get("/user", likedislikeCtrl.getUsermessLike);
//
module.exports = router;

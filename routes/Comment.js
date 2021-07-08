const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/Comment");
//
// Creer un nouveau commentaire pour un message
//
router.post("/", commentCtrl.createComment);
//
// Modifier un commentaire
//
router.put("/:commentID", commentCtrl.modifyComment);
//
// Supprimer un commentaire
//
router.delete("/:commentID", commentCtrl.deleteComment);
//
// Afficher un commentaire
//
router.get("/:commentID", commentCtrl.getOneComment);
//
module.exports = router;

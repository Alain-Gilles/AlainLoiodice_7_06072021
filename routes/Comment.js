const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/Comment");
const auth = require("../middleware/auth");
//
// Creer un nouveau commentaire pour un message
//
router.post("/", auth, commentCtrl.createComment);
//
// Modifier un commentaire
//
router.put("/:commentID", auth, commentCtrl.modifyComment);
//
// Supprimer un commentaire
//
router.delete("/:commentID", auth, commentCtrl.deleteComment);
//
// Afficher un commentaire
//
router.get("/:commentID", auth, commentCtrl.getOneComment);
//
module.exports = router;

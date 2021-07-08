const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/Message");
//
// Créer un nouveau message
//
router.post("/", messageCtrl.createMessage);
//
// Modifier un message
//
router.put("/:messageID", messageCtrl.modifyMessage);
//
// Supprimer un message
//
router.delete("/:messageID", messageCtrl.deleteMessage);
//
// Afficher tous les messages
//
router.get("/", messageCtrl.getAllMessage);
//
// Afficher tous les commentaires d'un message
//
router.get("/comm/:messageID", messageCtrl.getAllCommFromMessage);
//
// Afficher un message
//
router.get("/:messageID", messageCtrl.getOneMessage);
//
module.exports = router;

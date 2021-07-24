const express = require("express");
const router = express.Router();
const messageCtrl = require("../controllers/Message");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//
// Créer un nouveau message
//
router.post("/", auth, messageCtrl.createMessage);
//
// Modifier un message
//
router.put("/:messageID", auth, messageCtrl.modifyMessage);
//
// Supprimer un message
//
router.delete("/:messageID", auth, messageCtrl.deleteMessage);
//
// Afficher tous les messages
//
//router.get("/", auth, messageCtrl.getAllMessage);
router.post("/get", auth, messageCtrl.getAllMessage);
//
// Afficher tous les commentaires d'un message
//
router.get("/comm/:messageID", auth, messageCtrl.getAllCommFromMessage);
//
// Afficher un message
//
//router.get("/:messageID", auth, messageCtrl.getOneMessage);
router.post("/getOne/:messageID", auth, messageCtrl.getOneMessage);
//
module.exports = router;

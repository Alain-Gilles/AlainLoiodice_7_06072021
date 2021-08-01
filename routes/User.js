const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/User");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);

router.post("/login", userCtrl.login);

//
// Afficher tous les utilisateurs
//
router.get("/", auth, userCtrl.getAllUser);
//
// Supprimer un utilisateur
//
router.delete("/:userID", auth, userCtrl.deleteOneUser);
//
module.exports = router;

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/Gestuser");
const auth = require("../middleware/auth");

router.delete("/", auth, userCtrl.deleteUser);

module.exports = router;

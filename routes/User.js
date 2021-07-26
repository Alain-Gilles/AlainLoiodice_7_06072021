const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/User");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);

router.post("/login", userCtrl.login);

//////
router.post("/", auth, userCtrl.getAllUser);
/////
module.exports = router;

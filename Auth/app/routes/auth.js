const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/:id", auth, userCtrl.update);
router.delete("/:id",auth, userCtrl.delete);
router.get("/info", auth, userCtrl.getUserInfoFromToken);

module.exports = router;
const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/:id", auth, userCtrl.update);
router.put("/saveArticle/:id", auth, userCtrl.saveArticle);
router.put("/upvoteArticle/:id", auth, userCtrl.upvoteArticle);
router.put("/articlesHistory/:id", auth, userCtrl.articlesHistory);
router.delete("/:id",auth, userCtrl.delete);
router.get("/info", auth, userCtrl.getUserInfoFromToken);
router.get("/:id", userCtrl.getUserById);

module.exports = router;
const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.put("/saveArticle/:id", auth, userCtrl.saveArticle);
router.put("/upvoteArticle/:id", auth, userCtrl.upvoteArticle);
router.put("/articlesHistory/:id", auth, userCtrl.articlesHistory);
router.put("/removeArticleByIds", auth, userCtrl.removeArticleByIds);
router.put("/savePost/:id", auth, userCtrl.savePost);
router.put("/upvotePost/:id", auth, userCtrl.upvotePost);
router.put("/postsHistory/:id", auth, userCtrl.postsHistory);
router.put("/removePostByIds", auth, userCtrl.removePostByIds);
router.put("/:id", auth, userCtrl.update);
router.delete("/:id",auth, userCtrl.delete);
router.get("/info", auth, userCtrl.getUserInfoFromToken);
router.get("/users", userCtrl.getAll);
router.get("/:id", userCtrl.getUserById);
router.get("/confirm-email/:token", userCtrl.confirmEmail);

module.exports = router;
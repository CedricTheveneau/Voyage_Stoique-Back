const express = require("express");
const router = express();
const articleCtrl = require("../controllers/article.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, articleCtrl.create);
router.get("/admin/", bouncer, articleCtrl.getAll);
router.get("/:id", bouncer, articleCtrl.getArticle);
router.get("/keyword/:keyword", bouncer, articleCtrl.getArticlesByKeyword);
router.get("/category/:category", bouncer, articleCtrl.getArticlesByCategory);
router.put("/admin/:id", bouncer, articleCtrl.updateAdmin);
router.put("/upvote/:id", bouncer, articleCtrl.upvote);
router.put("/comment/:id", bouncer, articleCtrl.comment);
router.put("/save/:id", bouncer, articleCtrl.save);
router.delete("/:id", bouncer, articleCtrl.delete);

module.exports = router;
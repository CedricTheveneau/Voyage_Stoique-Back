const express = require("express");
const router = express();
const articleCtrl = require("../controllers/article.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, articleCtrl.create);
router.get("/admin/", bouncer, articleCtrl.getAll);
router.get("/latest", articleCtrl.getLatest);
router.get("/recent", articleCtrl.getNextArticles);
router.get("/by-ids", articleCtrl.getArticlesByIds);
router.get("/search", articleCtrl.getArticlesByQuery);
router.get("/:id", articleCtrl.getArticle);
router.get("/keyword/:keyword", articleCtrl.getArticlesByKeyword);
router.get("/category/:category", articleCtrl.getArticlesByCategory);
router.get("/recommendations/:id", bouncer, articleCtrl.getArticleRecommendations);
router.put("/admin/:id", bouncer, articleCtrl.updateAdmin);
router.put("/upvote/:id", bouncer, articleCtrl.upvote);
router.put("/comment/:id", bouncer, articleCtrl.comment);
router.put("/save/:id", bouncer, articleCtrl.save);
router.delete("/:id", bouncer, articleCtrl.delete);

module.exports = router;
const express = require("express");
const router = express();
const postCtrl = require("../controllers/post.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, postCtrl.create);
router.get("/", postCtrl.getAll);
router.get("/by-ids", postCtrl.getPostsByIds);
router.get("/search", postCtrl.getPostsByQuery);
router.get("/:id", postCtrl.getPost);
router.get("/keyword/:keyword", postCtrl.getPostsByKeyword);
router.get("/category/:category", postCtrl.getPostsByCategory);
router.get("/author/:id", postCtrl.getPostsByAuthor);
router.put("/removeCommentsByIds", bouncer, postCtrl.removeCommentsByIds);
router.put("/updateByAuthor/:id", bouncer, postCtrl.updateByAuthor);
router.put("/:id", bouncer, postCtrl.update);
router.put("/upvote/:id", bouncer, postCtrl.upvote);
router.put("/comment/:id", bouncer, postCtrl.comment);
router.put("/save/:id", bouncer, postCtrl.save);
router.put("/read/:id", bouncer, postCtrl.addRead);
router.delete("/:id", bouncer, postCtrl.delete);
router.post("/deletePostFile", bouncer, postCtrl.deletePostFile)


module.exports = router;
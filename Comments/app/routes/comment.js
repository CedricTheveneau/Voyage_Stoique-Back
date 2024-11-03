const express = require("express");
const router = express();
const commentCtrl = require("../controllers/comment.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, commentCtrl.create);
router.get("/", bouncer, commentCtrl.getAll);
router.get("/by-ids", commentCtrl.getCommentsByIds);
router.get("/:id", bouncer, commentCtrl.getComment);
router.get("/author/:id", commentCtrl.getCommentsByAuthor);
router.put("/updateByAuthor/:id", bouncer, commentCtrl.updateByAuthor);
router.put("/:id", bouncer, commentCtrl.update);
router.put("/upvote/:id", bouncer, commentCtrl.upvote);
router.delete("/by-ids", bouncer, commentCtrl.deleteByIds);
router.delete("/:id", bouncer, commentCtrl.delete);

module.exports = router;
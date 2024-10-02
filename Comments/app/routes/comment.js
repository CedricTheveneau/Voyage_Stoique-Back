const express = require("express");
const router = express();
const commentCtrl = require("../controllers/comment.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, commentCtrl.create);
router.get("/", bouncer, commentCtrl.getAll);
router.get("/:id", bouncer, commentCtrl.getComment);
router.get("/author/:id", bouncer, commentCtrl.getCommentsByAuthor);
router.put("/:id", bouncer, commentCtrl.update);
router.delete("/:id", bouncer, commentCtrl.delete);

module.exports = router;
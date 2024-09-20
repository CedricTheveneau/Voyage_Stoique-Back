const express = require("express");
const router = express();
const commentCtrl = require("../controllers/comment.js");

router.post("/create", commentCtrl.create);
router.get("/", commentCtrl.getAll);
router.get("/:id", commentCtrl.getComment);
router.put("/:id", commentCtrl.update);
router.delete("/:id", commentCtrl.delete);

module.exports = router;
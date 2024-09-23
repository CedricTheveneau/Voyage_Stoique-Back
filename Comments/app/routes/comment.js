const express = require("express");
const router = express();
const commentCtrl = require("../controllers/comment.js");

router.post("/create", commentCtrl.create);
router.get("/admin/", commentCtrl.getAll);
router.get("/:id", commentCtrl.getComment);
router.get("/author/:id", commentCtrl.getComentsByAuthor);
router.put("/:id", commentCtrl.update);
router.delete("/:id", commentCtrl.delete);

module.exports = router;
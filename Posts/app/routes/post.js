const express = require("express");
const router = express();
const postCtrl = require("../controllers/post.js");

router.post("/create", postCtrl.create);
router.get("/", postCtrl.getAll);
router.get("/:id", postCtrl.getPost);
router.put("/:id", postCtrl.update);
router.delete("/:id", postCtrl.delete);

module.exports = router;
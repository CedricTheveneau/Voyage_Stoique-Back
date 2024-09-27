const express = require("express");
const router = express();
const postCtrl = require("../controllers/post.js");
const {uploadDirectory, upload } = require("../middlewares/imgUpload");

router.post("/create", uploadDirectory, upload.single('cover'), postCtrl.create);
router.get("/admin/", postCtrl.getAll);
router.get("/:id", postCtrl.getPost);
router.get("/keyword/:keyword", postCtrl.getPostsByKeyword);
router.get("/category/:category", postCtrl.getPostsByCategory);
router.get("/author/:id", postCtrl.getPostsByAuthor);
router.put("/:id", uploadDirectory, upload.single('cover'), postCtrl.update);
router.delete("/:id", postCtrl.delete);


module.exports = router;
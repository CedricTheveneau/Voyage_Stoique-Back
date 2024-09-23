const express = require("express");
const router = express();
const articleCtrl = require("../controllers/article.js");
const {uploadDirectory, upload, compressImage } = require("../middlewares/imgUpload");
const { uploadAudioDirectory, uploadAudio, compressAudio } = require("../middlewares/audioUpload")

router.post("/create", uploadDirectory, upload.single('cover'), compressImage, uploadAudioDirectory, uploadAudio.single('audio'), compressAudio, articleCtrl.create);
router.get("/admin/", articleCtrl.getAll);
router.get("/:id", articleCtrl.getArticle);
router.get("/keyword/:keyword", articleCtrl.getArticlesByKeyword);
router.get("/category/:category", articleCtrl.getArticlesByCategory);
router.get("/author/:id", articleCtrl.getArticlesByAuthor);
router.put("/admin/:id", uploadDirectory, upload.single('cover'), compressImage, uploadAudioDirectory, uploadAudio.single('audio'), compressAudio, articleCtrl.updateAdmin);
router.put("/:id", articleCtrl.updateUser);
router.delete("/:id", articleCtrl.delete);

module.exports = router;
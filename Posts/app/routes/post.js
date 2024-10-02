const express = require("express");
const router = express();
const postCtrl = require("../controllers/post.js");
const bouncer = require("../middlewares/bouncer.js");

router.post("/create", bouncer, postCtrl.create);
router.get("/admin/", bouncer, postCtrl.getAll);
router.get("/:id", bouncer, postCtrl.getPost);
router.get("/keyword/:keyword", bouncer, postCtrl.getPostsByKeyword);
router.get("/category/:category", bouncer, postCtrl.getPostsByCategory);
router.get("/author/:id", bouncer, postCtrl.getPostsByAuthor);
router.put("/:id", bouncer, postCtrl.update);
router.delete("/:id", bouncer, postCtrl.delete);


module.exports = router;
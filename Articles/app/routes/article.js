const express = require("express");
const router = express();
const articleCtrl = require("../controllers/article.js");

router.post("/create", articleCtrl.create);
router.get("/", articleCtrl.getAll);
router.get("/:id", articleCtrl.getKard);
router.put("/:id", articleCtrl.update);
router.delete("/:id", articleCtrl.delete);

module.exports = router;
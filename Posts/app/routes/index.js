const express = require("express");
const router = express();
const postRoutes = require("./post.js");

router.use("/", postRoutes);

module.exports = router;
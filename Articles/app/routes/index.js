const express = require("express");
const router = express();
const articleRoutes = require("./article.js");

router.use("/", articleRoutes);

module.exports = router;
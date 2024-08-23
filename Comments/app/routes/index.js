const express = require("express");
const router = express();
const commentRoutes = require("./comment.js");

router.use("/", commentRoutes);

module.exports = router;
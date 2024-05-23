// Call of the required modules
const express = require("express");
const router = express();
const healthRoutes = require("./health.js");
// const userRoutes = require("./user.js");
// const accountRoutes = require("./account.js");
// const accountLineRoutes = require("./accountLine.js");

router.use("/health", healthRoutes);

// User routes
// router.use("/user", userRoutes);

// account routes
// router.use("/account", accountRoutes);

// accountLine routes
// router.use("/accountLine", accountLineRoutes);

module.exports = router;

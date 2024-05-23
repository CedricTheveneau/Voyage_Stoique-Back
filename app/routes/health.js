const express = require("express");
const router = express();
const healthCtrl = require("../controllers/health.js");

router.get("/check", healthCtrl.check);

module.exports = router;

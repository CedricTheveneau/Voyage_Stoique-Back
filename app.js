const express = require("express");
const cors = require("cors");
// Importantion de la connexion à MongoDB
require("./app/models/index.js");

const router = require("./app/routes/index.js");

const app = express();
app.use(cors());
app.use(express.json());

//Ajout des routes
app.use("/api", router);

module.exports = app;

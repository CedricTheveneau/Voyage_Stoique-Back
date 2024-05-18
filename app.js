const express = require("express");
// Importantion de la connexion à MongoDB
require("./app/models/index.js");

const router = require("./app/routes/index.js");

const app = express();
app.use(express.json());

//Ajout des routes
app.use("/api", router);

module.exports = app;

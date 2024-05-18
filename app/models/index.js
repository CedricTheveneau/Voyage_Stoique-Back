const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URI, { ssl: true })
  .then(() => console.log("MongoDB connected !"))
  .catch(() => console.log("Erreur with MongoDB connection"));

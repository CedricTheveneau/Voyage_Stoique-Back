const mongoose = require("mongoose");

exports.check = async (req, res) => {
  const dbState = mongoose.connection.readyState;

  // Les états possibles de la connexion
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  if (dbState === 1) {
    // 1 corresponds to connected
    res.status(200).json({
      status: "healthy",
      dbState: states[dbState],
      message: "API is connected to MongoDB Atlas",
    });
  } else {
    res.status(500).json({
      status: "unhealthy",
      dbState: states[dbState],
      message: "API is not connected to MongoDB Atlas",
    });
  }
};

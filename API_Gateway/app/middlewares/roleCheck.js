const axios = require("axios");
const proxyURIAuth = process.env.PROXY_URI_AUTH;

module.exports = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const response = await axios.get(`${proxyURIAuth}/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { userRole } = response.data;

      if (userRole !== "admin") {
        return res.status(403).json({
          error: "Access denied !",
        });
      }
      next();
    }
  } catch (err) {
    res.status(401).json({
      error: "Access denied !",
    });
  }
};
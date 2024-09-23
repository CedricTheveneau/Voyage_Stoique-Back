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

      req.userRole = userRole;
    } else {
      req.userRole = "guest";
    }

    const path = req.path;

    if (path.startsWith("/api/articles")) {
      if (req.method === "POST" || req.method === "DELETE") {
       if (userRole !== "admin") {
        return res.status(403).json({ error: "Only admins can create or delete articles." });
       }
      } else if (req.method === "PUT") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can update everything about articles." });
          }
         } else if (userRole === "guest") {
          return res.status(403).json({ error: "Only connected users can interact with articles." });
         }
      } else if (req.method === "GET") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can read everything about articles." });
          }
         }
      }
    }

    if (path.startsWith("/api/posts")) {
      if (req.method === "POST" || req.method === "DELETE") {
       if (userRole === "guest") {
        return res.status(403).json({ error: "Only admins can create or delete posts." });
       }
      } else if (req.method === "PUT") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can update everything about posts." });
          }
         } else if (userRole === "guest") {
          return res.status(403).json({ error: "Only connected users can interact with posts." });
         }
      } else if (req.method === "GET") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can read everything about posts." });
          }
         }
      }
    }

    if (path.startsWith("/api/comments")) {
      if (req.method === "POST" || req.method === "DELETE") {
       if (userRole === "guest") {
        return res.status(403).json({ error: "Only admins can create or delete comments." });
       }
      } else if (req.method === "PUT") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can update everything about comments." });
          }
         } else if (userRole === "guest") {
          return res.status(403).json({ error: "Only connected users can interact with comments." });
         }
      } else if (req.method === "GET") {
        if (path.includes('/admin/')) {
          if (userRole !== "admin") {
            return res.status(403).json({ error: "Only admins can read everything about comments." });
          }
         }
      }
    }
    
    next();
  } catch (err) {
    res.status(401).json({ error: "Something went wrong while checking the user's role." });
  }
};
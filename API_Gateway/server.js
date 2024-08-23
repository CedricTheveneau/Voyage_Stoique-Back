require("dotenv").config();
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const roleCheck = require("./app/middlewares/roleCheck.js");
const port = process.env.PORT || 8080;
const proxyURIAuth = process.env.PROXY_URI_AUTH;
const proxyURIArticles = process.env.PROXY_URI_ARTICLES;
const proxyURIComments = process.env.PROXY_URI_COMMENTS;
const proxyURIPosts = process.env.PROXY_URI_POSTS;

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/api/auth", proxy(proxyURIAuth));
app.use("/api/articles", roleCheck, proxy(proxyURIArticles));
app.use("/api/comments", roleCheck, proxy(proxyURIComments));
app.use("/api/posts", roleCheck, proxy(proxyURIPosts));

app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
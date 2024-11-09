require("dotenv").config();
const axios = require('axios');
const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const bouncer = require("./app/middlewares/bouncer");
const port = process.env.PORT || 8080;
const proxyURIAuth = process.env.PROXY_URI_AUTH;
const proxyURIArticles = process.env.PROXY_URI_ARTICLES;
const proxyURIComments = process.env.PROXY_URI_COMMENTS;
const proxyURIPosts = process.env.PROXY_URI_POSTS;

const swaggerModule = require('./swagger');
const swaggerUi = swaggerModule.swaggerUi;
const swaggerDocs = swaggerModule.swaggerDocs;

const allowedOrigins = process.env.CORS_ORIGIN.split(',');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function aggregateSwaggerDocs() {
    try {
      const authSwagger = await axios.get('http://auth:8081/swagger.json');
      const articlesSwagger = await axios.get('http://articles:8082/swagger.json');
      const commentsSwagger = await axios.get('http://comments:8083/swagger.json');
      const postsSwagger = await axios.get('http://posts:8084/swagger.json');
  
      // Vous pouvez ajouter plus de services Swagger ici (Comments, Posts, etc.)
  
      // Fusionner les chemins (paths) et autres éléments de la doc
      const aggregatedSwagger = {
        openapi: '3.0.0',
        info: {
          title: 'API complète',
          description: 'Documentation de l\'API complète, incluant tous les micro-services.',
          version: '1.0.0',
        },
        paths: {
          ...authSwagger.data.paths,
          ...articlesSwagger.data.paths,
          ...commentsSwagger.data.paths,
          ...postsSwagger.data.paths,
        },
        components: {
          ...authSwagger.data.components,
          ...articlesSwagger.data.components,
          ...commentsSwagger.data.components,
          ...postsSwagger.data.components,
        },
      };
  
      return aggregatedSwagger;
    } catch (error) {
      console.error('Erreur lors de la récupération des Swagger docs:', error);
      throw error;
    }
  }

app.use("/api/auth", proxy(proxyURIAuth));
app.use("/api/articles", bouncer, proxy(proxyURIArticles));
app.use("/api/comments", bouncer, proxy(proxyURIComments));
app.use("/api/posts", bouncer, proxy(proxyURIPosts));
app.use('/api/docs', async (req, res, next) => {
    try {
      const aggregatedDocs = await aggregateSwaggerDocs();
      swaggerUi.setup(aggregatedDocs)(req, res, next);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la génération de la documentation.' });
    }
  });

app.use('/api/docs-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
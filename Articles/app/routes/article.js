const express = require("express");
const router = express();
const articleCtrl = require("../controllers/article.js");
const bouncer = require("../middlewares/bouncer.js");
const swaggerSpec = require('../../swagger.js')

router.get('/swagger.json', (req, res) => {
 res.json(swaggerSpec);
});

router.post("/create", bouncer, articleCtrl.create);
router.get("/", articleCtrl.getAll);
router.get("/latest", articleCtrl.getLatest);
router.get("/recent", articleCtrl.getNextArticles);
router.get("/top", articleCtrl.getTopArticles);
router.get("/by-ids", articleCtrl.getArticlesByIds);
router.get("/search", articleCtrl.getArticlesByQuery);
router.get("/:id", articleCtrl.getArticle);
router.get("/keyword/:keyword", articleCtrl.getArticlesByKeyword);
router.get("/category/:category", articleCtrl.getArticlesByCategory);
router.get("/recommendations/:id", bouncer, articleCtrl.getArticleRecommendations);
router.put("/admin/:id", bouncer, articleCtrl.updateAdmin);
router.put("/removeCommentsByIds", bouncer, articleCtrl.removeCommentsByIds);
router.put("/upvote/:id", bouncer, articleCtrl.upvote);
router.put("/comment/:id", bouncer, articleCtrl.comment);
router.put("/save/:id", bouncer, articleCtrl.save);
router.put("/read/:id", bouncer, articleCtrl.addRead);
router.delete("/:id", bouncer, articleCtrl.delete);
router.post("/deleteArticleFile", bouncer, articleCtrl.deleteArticleFile)

module.exports = router;

/**
 * @swagger
 * /api/articles/create:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Title of the Article"
 *               intro:
 *                 type: string
 *                 example: "Introduction of the article."
 *               cover:
 *                 type: string
 *                 example: "url/to/cover/image.jpg"
 *               content:
 *                 type: string
 *                 example: "Full content of the article."
 *               audio:
 *                 type: string
 *                 example: "url/to/audio/file.mp3"
 *               publishDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-10-21T10:00:00Z"
 *               category:
 *                 type: string
 *                 enum: ["méditation", "portrait", "présentation d’œuvre", "concept", "analyse"]
 *                 example: "méditation"
 *               author:
 *                 type: string
 *                 example: "Author Name"
 *               readingTime:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Article created successfully
 *       500:
 *         description: Server error
 *       403:
 *         description: Permission restriction
 */

/**
 * @swagger
 * /api/articles/admin:
 *   get:
 *     summary: Retrieve all articles (admin)
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   intro:
 *                     type: string
 *                   cover:
 *                     type: string
 *                   content:
 *                     type: string
 *                   audio:
 *                     type: string
 *                   publishDate:
 *                     type: string
 *                     format: date-time
 *                   category:
 *                     type: string
 *                   author:
 *                     type: string
 *                   readingTime:
 *                     type: number
 */

/**
 * @swagger
 * /api/articles/latest:
 *   get:
 *     summary: Retrieve the latest articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: A list of the latest articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/recent:
 *   get:
 *     summary: Retrieve recent articles
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: A list of recent articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/by-ids:
 *   get:
 *     summary: Retrieve articles by IDs
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         description: Comma-separated list of article IDs
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Search for articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Search query string
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of articles matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Retrieve a specific article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /api/articles/keyword/{keyword}:
 *   get:
 *     summary: Retrieve articles by keyword
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: keyword
 *         required: true
 *         description: Keyword to search articles
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of articles matching the keyword
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/category/{category}:
 *   get:
 *     summary: Retrieve articles by category
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Category to filter articles
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of articles in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/recommendations/{id}:
 *   get:
 *     summary: Get article recommendations based on ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to base recommendations on
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of recommended articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */

/**
 * @swagger
 * /api/articles/admin/{id}:
 *   put:
 *     summary: Update an article (admin)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               intro:
 *                 type: string
 *               cover:
 *                 type: string
 *               content:
 *                 type: string
 *               audio:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: ["méditation", "portrait", "présentation d’œuvre", "concept", "analyse"]
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /api/articles/upvote/{id}:
 *   put:
 *     summary: Upvote an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to upvote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article upvoted successfully
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /api/articles/comment/{id}:
 *   put:
 *     summary: Add a comment to an article
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to comment on
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: "newCommentId"
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: ["commentId1", "commentId2", "commentId3"]
 *       404:
 *         description: Article not found
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/articles/save/{id}:
 *   put:
 *     summary: Save an article for later
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to save
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article saved successfully
 *       404:
 *         description: Article not found
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the article to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Article deleted successfully
 *       404:
 *         description: Article not found
 */
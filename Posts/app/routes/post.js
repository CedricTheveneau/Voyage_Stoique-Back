const express = require("express");
const router = express();
const postCtrl = require("../controllers/post.js");
const bouncer = require("../middlewares/bouncer.js");

const swaggerSpec = require('../../swagger.js')

router.get('/swagger.json', (req, res) => {
 res.json(swaggerSpec);
});

router.post("/create", bouncer, postCtrl.create);
router.get("/", postCtrl.getAll);
router.get("/by-ids", postCtrl.getPostsByIds);
router.get("/search", postCtrl.getPostsByQuery);
router.get("/:id", postCtrl.getPost);
router.get("/keyword/:keyword", postCtrl.getPostsByKeyword);
router.get("/category/:category", postCtrl.getPostsByCategory);
router.get("/author/:id", postCtrl.getPostsByAuthor);
router.put("/removeCommentsByIds", bouncer, postCtrl.removeCommentsByIds);
router.put("/updateByAuthor/:id", bouncer, postCtrl.updateByAuthor);
router.put("/:id", bouncer, postCtrl.update);
router.put("/upvote/:id", bouncer, postCtrl.upvote);
router.put("/comment/:id", bouncer, postCtrl.comment);
router.put("/save/:id", bouncer, postCtrl.save);
router.put("/read/:id", bouncer, postCtrl.addRead);
router.delete("/:id", bouncer, postCtrl.delete);
router.post("/deletePostFile", bouncer, postCtrl.deletePostFile)


module.exports = router;

/**
 * @swagger
 * /api/posts/create:
 *   post:
 *     summary: Create a new article
 *     tags: [Posts]
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
 * /api/posts/admin:
 *   get:
 *     summary: Retrieve all articles (admin)
 *     tags: [Posts]
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
 * /api/posts/latest:
 *   get:
 *     summary: Retrieve the latest articles
 *     tags: [Posts]
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
 * /api/posts/recent:
 *   get:
 *     summary: Retrieve recent articles
 *     tags: [Posts]
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
 * /api/posts/by-ids:
 *   get:
 *     summary: Retrieve articles by IDs
 *     tags: [Posts]
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
 * /api/posts/search:
 *   get:
 *     summary: Search for articles
 *     tags: [Posts]
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
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a specific article by ID
 *     tags: [Posts]
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
 * /api/posts/keyword/{keyword}:
 *   get:
 *     summary: Retrieve articles by keyword
 *     tags: [Posts]
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
 * /api/posts/category/{category}:
 *   get:
 *     summary: Retrieve articles by category
 *     tags: [Posts]
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
 * /api/posts/recommendations/{id}:
 *   get:
 *     summary: Get article recommendations based on ID
 *     tags: [Posts]
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
 * /api/posts/admin/{id}:
 *   put:
 *     summary: Update an article (admin)
 *     tags: [Posts]
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
 * /api/posts/upvote/{id}:
 *   put:
 *     summary: Upvote an article
 *     tags: [Posts]
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
 * /api/posts/comment/{id}:
 *   put:
 *     summary: Add a comment to an article
 *     tags: [Posts]
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
 * /api/posts/save/{id}:
 *   put:
 *     summary: Save an article for later
 *     tags: [Posts]
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
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     tags: [Posts]
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
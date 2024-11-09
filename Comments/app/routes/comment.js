const express = require("express");
const router = express();
const commentCtrl = require("../controllers/comment.js");
const bouncer = require("../middlewares/bouncer.js");

const swaggerSpec = require('../../swagger.js')

router.get('/swagger.json', (req, res) => {
 res.json(swaggerSpec);
});

router.post("/create", bouncer, commentCtrl.create);
router.get("/", bouncer, commentCtrl.getAll);
router.get("/by-ids", commentCtrl.getCommentsByIds);
router.get("/:id", bouncer, commentCtrl.getComment);
router.get("/author/:id", commentCtrl.getCommentsByAuthor);
router.put("/updateByAuthor/:id", bouncer, commentCtrl.updateByAuthor);
router.put("/:id", bouncer, commentCtrl.update);
router.put("/upvote/:id", bouncer, commentCtrl.upvote);
router.delete("/by-ids", bouncer, commentCtrl.deleteByIds);
router.delete("/:id", bouncer, commentCtrl.delete);

module.exports = router;

/**
 * @swagger
 * /api/comments/create:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 example: "Author Name"
 *               authorUsername:
 *                 type: string
 *                 example: "author_username"
 *               content:
 *                 type: string
 *                 example: "This is a comment."
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/by-ids:
 *   get:
 *     summary: Get comments by their IDs
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         description: Comma-separated list of comment IDs
 *         schema:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85,60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Get a comment by its ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The comment details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/author/{id}:
 *   get:
 *     summary: Get comments by author ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the author
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments by the author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated comment content."
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/upvote/{id}:
 *   put:
 *     summary: Upvote a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to upvote
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment upvoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 author:
 *                   type: string
 *                 authorUsername:
 *                   type: string
 *                 content:
 *                   type: string
 *                 publishDate:
 *                   type: string
 *                   format: date-time
 *                 lastModifiedDate:
 *                   type: string
 *                   format: date-time
 *                 upvotes:
 *                   type: array
 *                   items:
 *                     type: string
 */
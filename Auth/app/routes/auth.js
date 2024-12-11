const express = require("express");
const router = express();
const userCtrl = require("../controllers/user.js");
const auth = require("../middlewares/auth.js");
const swaggerSpec = require('../../swagger.js')

router.get('/swagger.json', (req, res) => {
 res.json(swaggerSpec);
});


router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.post("/contact", userCtrl.contact);
router.put("/saveArticle/:id", auth, userCtrl.saveArticle);
router.put("/upvoteArticle/:id", auth, userCtrl.upvoteArticle);
router.put("/articlesHistory/:id", auth, userCtrl.articlesHistory);
router.put("/removeArticleByIds", auth, userCtrl.removeArticleByIds);
router.put("/removePostByIds", auth, userCtrl.removePostByIds);
router.put("/savePost/:id", auth, userCtrl.savePost);
router.put("/upvotePost/:id", auth, userCtrl.upvotePost);
router.put("/postsHistory/:id", auth, userCtrl.postsHistory);
router.put("/:id", auth, userCtrl.update);
router.delete("/:id",auth, userCtrl.delete);
router.get("/info", auth, userCtrl.getUserInfoFromToken);
router.get("/users", userCtrl.getAll);
router.get("/:id", userCtrl.getUserById);
router.get("/confirm-email/:token", userCtrl.confirmEmail);

module.exports = router;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "P@ssw0rd!"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 emailConfirmed:
 *                   type: boolean
 *                   example: false
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin"]
 *                   example: "user"
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "P4ssw0rd!"
 *     responses:
 *       200:
 *         description: User logged in successfully, returns user token
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe_updated"
 *               email:
 *                 type: string
 *                 example: "john_updated@example.com"
 *     responses:
 *       200:
 *         description: User information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 emailConfirmed:
 *                   type: boolean
 *                   example: false
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin"]
 *                   example: "user"
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/saveArticle/{id}:
 *   put:
 *     summary: Save an article for the user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "603d2b2f1f4e112f60dca0f5"
 *     responses:
 *       200:
 *         description: Article saved successfully, returns an array of saved article IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/auth/upvoteArticle/{id}:
 *   put:
 *     summary: Upvote an article
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "603d2b2f1f4e112f60dca0f5"
 *     responses:
 *       200:
 *         description: Article upvoted successfully, returns an array of upvoted article IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/auth/articlesHistory/{id}:
 *   put:
 *     summary: Add an article to the user's history
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "603d2b2f1f4e112f60dca0f5"
 *     responses:
 *       200:
 *         description: Article history updated successfully, returns an array of article history IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */

/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 emailConfirmed:
 *                   type: boolean
 *                   example: false
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin"]
 *                   example: "user"
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 emailConfirmed:
 *                   type: boolean
 *                   example: false
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin"]
 *                   example: "user"
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/auth/info:
 *   get:
 *     summary: Get user info from token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 emailConfirmed:
 *                   type: boolean
 *                   example: false
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 role:
 *                   type: string
 *                   enum: ["user", "admin"]
 *                   example: "user"
 *                 registrationDate:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized, token not provided or invalid
 */

/**
 * @swagger
 * /api/auth/confirm-email/{token}:
 *   get:
 *     summary: Confirm user email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token for email confirmation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       404:
 *         description: Confirmation token not found
 */
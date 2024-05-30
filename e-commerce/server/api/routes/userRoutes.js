const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user operations
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, invalid input
 */
router.post('/user/signup', userController.signup_post);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.post('/user/login', userController.login_post);


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information based on authentication token
 *     description: Retrieves the information of the authenticated user based on the JWT token provided in the cookie.
 *     responses:
 *       '200':
 *         description: OK. Returns the user's information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the user.
 *                     username:
 *                       type: string
 *                       description: The username of the user.
 *                     email:
 *                       type: string
 *                       description: The email address of the user.
 *                     role:
 *                       type: string
 *                       description: The role of the user.
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 *     tags: [Users]
 */
router.get('/user', userController.user_get);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized, user not logged in
 */
router.post('/user/logout', userController.logout_get);

module.exports = router;

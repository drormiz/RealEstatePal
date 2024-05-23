import { AsyncRouter } from 'express-async-router';
import validate from '../middlewares/validation.middleware.js';
import { LoginUserValidationSchema, NewUserValidationSchema } from '../api/users/user.validate.js';
import { authUser, loginUser, registerUser, googleSignin, refresh, logout } from './auth.controller.js';

const router = AsyncRouter();
/**
* @swagger
* tags:
*   name: Authentication
*   description: The Authentication API
*/


/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
 * @swagger
 * auth/me:
 *   get:
 *     summary: Get user information
 *     description: Fetch information about the authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - User not authenticated
 *       500:
 *         description: Internal Server Error - Error during user information retrieval
 */

router.get('/me', authUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: john_doe
 *         password:
 *           type: string
 *           format: password
 *           description: The password of the user.
 *           example: mySecurePassword
 * 
 * auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and obtain access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token for the authenticated user.
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for the authenticated user.
 *       401:
 *         description: Unauthorized - Invalid username or password
 *       500:
 *         description: Internal Server Error - Error during login process
 */
router.post('/login', validate(LoginUserValidationSchema), loginUser);

/**
* @swagger
* auth/register:
*   post:
*     summary: registers a new user
*     tags: 
*       - Authentication
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: The new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*/
router.post('/register', validate(NewUserValidationSchema), registerUser);

/**
 * @swagger
 * auth/google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     description: Redirects the user to Google for authentication.
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 *       500:
 *         description: Internal Server Error - Error during Google authentication initiation
 */
router.post("/google", googleSignin);

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: The new access token.
 *         refreshToken:
 *           type: string
 *           description: The new refresh token.
 * 
 * auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: |
 *       Refresh the user's access token using a valid refresh token.
 *       If successful, a new access token and refresh token will be provided.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         description: Bearer token obtained during login
 *         schema:
 *           type: string
 *           format: JWT
 *     responses:
 *       200:
 *         description: Successful token refresh
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing refresh token
 *       500:
 *         description: Internal Server Error - Error during token refresh process
 */
router.get('/refresh', refresh);

// Logout route
/**
 * @swagger
 * auth/logout:
 *   post:
 *     summary: Logout a user
 *     description: Invalidate the user's refresh token, effectively logging them out.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         description: Bearer token obtained during login
 *         schema:
 *           type: string
 *           format: JWT
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Unauthorized - Invalid or missing refresh token
 *       500:
 *         description: Internal Server Error - Error during logout process
 */
router.get('/logout', logout);
export default router;
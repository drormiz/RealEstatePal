import { AsyncRouter } from 'express-async-router';
import { deleteUser, getUsers, updateUser } from './user.controller.js';
import { protect } from "../../middlewares/auth.middleware.js";

const router = AsyncRouter();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            description: The name of the user.
 *          username:
 *            type: string
 *            description: The username chosen by the user.
 *          password:
 *            type: string
 *            description: The encrypted password chosen by the user.
 *          email:
 *            type: string
 *            format: email
 *            description: The email address of the user.
 *          image:
 *            type: string
 *            description: URL or path to the user's profile image.
 *          refreshTokens:
 *            type: array
 *            items:
 *              type: string
 *            description: An array of refresh tokens associated with the user.
 * 
 * api/users/:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of all users.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful retrieval of user list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error - Error during user retrieval process
 * api/users/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: The unique identifier of the user.
 *       schema:
 *         type: string
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their unique identifier.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful retrieval of user by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error - Error during user retrieval process
 *   delete:
 *     summary: Delete user by ID
 *     description: Delete a user by their unique identifier.
 *     tags:
 *       - Users
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error - Error during user deletion process
 */
router.get('/', getUsers);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

export default router;
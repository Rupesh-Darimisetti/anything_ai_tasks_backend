const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Rupesh" }
 *               email: { type: string, example: "rupesh@example.com" }
 *               password: { type: string, example: "strongpassword" }
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: User already exists
 */
router.post('/register', register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive a JWT
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "rupesh@example.com" }
 *               password: { type: string, example: "strongpassword" }
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

module.exports = router;


const express = require('express');
const router = express.Router();
const { register, login, verifyLogin, refreshToken, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const { loginLimiter, otpLimiter } = require('../utils/rateLimiter');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new member
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, national_id, phone, email, password]
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Edouard Names
 *               national_id:
 *                 type: string
 *                 example: "1234567890"
 *               phone:
 *                 type: string
 *                 example: "+250788000000"
 *               email:
 *                 type: string
 *                 example: edouard@gmail.com
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login step 1 - verify password and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: edouard@gmail.com
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: OTP sent
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginLimiter, login);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Login step 2 - verify OTP and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 example: edouard@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful with accessToken and refreshToken
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-otp', otpLimiter, verifyLogin);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Get new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGci...
 *     responses:
 *       200:
 *         description: New access token issued
 *       403:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and invalidate refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 example: eyJhbGci...
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: edouard@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent if email exists
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp, new_password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: edouard@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               new_password:
 *                 type: string
 *                 example: newpass123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/reset-password', resetPassword);

module.exports = router;
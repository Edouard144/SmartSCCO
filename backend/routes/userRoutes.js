const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', protect, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+250788000000"
 *               email:
 *                 type: string
 *                 example: newemail@gmail.com
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', protect, updateProfile);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, submitKyc, searchUsers, changePassword } = require('../controllers/userController');
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

/**
 * @swagger
 * /api/users/kyc:
 *   post:
 *     summary: Submit KYC documents (Simulation)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KYC submitted
 */
router.post('/kyc', protect, submitKyc);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Search users by email, phone, name, or ID (for beneficiaries)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: Search query (email, phone, name, or ID)
 *     responses:
 *       200:
 *         description: List of matching users (excludes self)
 *       400:
 *         description: Query too short
 */
router.get('/search', protect, searchUsers);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change password (requires current password)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [current_password, new_password]
 *             properties:
 *               current_password:
 *                 type: string
 *                 example: "oldpass123"
 *               new_password:
 *                 type: string
 *                 example: "newpass456"
 *     responses:
 *       200:
 *         description: Password changed
 *       400:
 *         description: Current password wrong or new password too short
 */
router.post('/change-password', protect, changePassword);

module.exports = router;
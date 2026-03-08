const express = require('express');
const router = express.Router();
const { getMyCreditScore, getUserCreditScore, getAllCreditScores } = require('../controllers/creditController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/credit/my-score:
 *   get:
 *     summary: Get my credit score and breakdown
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credit score with rating and breakdown
 */
router.get('/my-score', protect, getMyCreditScore);

/**
 * @swagger
 * /api/credit/all:
 *   get:
 *     summary: Get all members credit scores (Admin only)
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members with scores
 */
router.get('/all', protect, allowRoles('staff', 'superadmin'), getAllCreditScores);

/**
 * @swagger
 * /api/credit/{user_id}:
 *   get:
 *     summary: Get credit score for a specific user (Admin only)
 *     tags: [Credit]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User credit score and breakdown
 */
router.get('/:user_id', protect, allowRoles('staff', 'superadmin'), getUserCreditScore);

module.exports = router;
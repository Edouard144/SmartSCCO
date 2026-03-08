const express = require('express');
const router = express.Router();
const { reverseTransaction, getReversals } = require('../controllers/reversalController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/reversals:
 *   get:
 *     summary: Get all reversed transactions (Admin only)
 *     tags: [Reversals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reversed transactions
 */
router.get('/', protect, allowRoles('staff', 'superadmin'), getReversals);

/**
 * @swagger
 * /api/reversals/{transaction_id}:
 *   post:
 *     summary: Reverse a transfer transaction (Admin only)
 *     tags: [Reversals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Wrong recipient"
 *     responses:
 *       200:
 *         description: Transaction reversed successfully
 *       400:
 *         description: Already reversed or not a transfer
 *       404:
 *         description: Transaction not found
 */
router.post('/:transaction_id', protect, allowRoles('staff', 'superadmin'), reverseTransaction);

module.exports = router;
const express = require('express');
const router = express.Router();
const { add, getAll, remove } = require('../controllers/beneficiaryController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/beneficiaries:
 *   get:
 *     summary: Get all saved beneficiaries
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of beneficiaries
 */
router.get('/', protect, getAll);

/**
 * @swagger
 * /api/beneficiaries:
 *   post:
 *     summary: Add a new beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [beneficiary_user_id]
 *             properties:
 *               beneficiary_user_id:
 *                 type: integer
 *                 example: 1
 *               nickname:
 *                 type: string
 *                 example: "Mom"
 *     responses:
 *       201:
 *         description: Beneficiary added
 *       400:
 *         description: Already saved or invalid
 */
router.post('/', protect, add);

/**
 * @swagger
 * /api/beneficiaries/{beneficiary_id}:
 *   delete:
 *     summary: Remove a beneficiary
 *     tags: [Beneficiaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: beneficiary_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Beneficiary removed
 *       404:
 *         description: Not found
 */
router.delete('/:beneficiary_id', protect, remove);

module.exports = router;
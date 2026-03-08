const express = require('express');
const router = express.Router();
const { setPin, verifyPin } = require('../controllers/pinController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/pin/set:
 *   post:
 *     summary: Set a 4-digit transaction PIN
 *     tags: [PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pin]
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN set successfully
 *       400:
 *         description: PIN must be exactly 4 digits
 */
router.post('/set', protect, setPin);

/**
 * @swagger
 * /api/pin/verify:
 *   post:
 *     summary: Verify transaction PIN (locks after 3 failed attempts)
 *     tags: [PIN]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pin]
 *             properties:
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: PIN verified
 *       400:
 *         description: Incorrect PIN
 *       403:
 *         description: PIN locked
 */
router.post('/verify', protect, verifyPin);

module.exports = router;
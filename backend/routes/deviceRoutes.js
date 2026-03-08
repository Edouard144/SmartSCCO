const express = require('express');
const router = express.Router();
const { getMyDevices } = require('../controllers/deviceController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/devices/my-devices:
 *   get:
 *     summary: Get all devices user has logged in from
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 */
router.get('/my-devices', protect, getMyDevices);

module.exports = router;
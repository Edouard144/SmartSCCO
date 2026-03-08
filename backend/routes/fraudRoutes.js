const express = require('express');
const router = express.Router();
const { getMyAlerts, getOpenAlerts, markResolved } = require('../controllers/fraudController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/fraud/my-alerts:
 *   get:
 *     summary: Get my fraud alerts
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of fraud alerts
 */
router.get('/my-alerts', protect, getMyAlerts);

/**
 * @swagger
 * /api/fraud/open:
 *   get:
 *     summary: Get all open fraud alerts (Admin only)
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of open alerts
 *       403:
 *         description: Access denied
 */
router.get('/open', protect, allowRoles('staff', 'superadmin'), getOpenAlerts);

/**
 * @swagger
 * /api/fraud/resolve/{alert_id}:
 *   put:
 *     summary: Resolve a fraud alert (Admin only)
 *     tags: [Fraud]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alert_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alert resolved
 *       403:
 *         description: Access denied
 */
router.put('/resolve/:alert_id', protect, allowRoles('staff', 'superadmin'), markResolved);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getAuditLogs, getUserAuditLogs } = require('../controllers/auditController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/audit:
 *   get:
 *     summary: Get all audit logs (Admin only)
 *     tags: [Audit]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Last 100 audit logs
 */
router.get('/', protect, allowRoles('staff', 'superadmin'), getAuditLogs);

/**
 * @swagger
 * /api/audit/{user_id}:
 *   get:
 *     summary: Get audit logs for a specific user (Admin only)
 *     tags: [Audit]
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
 *         description: User audit logs
 */
router.get('/:user_id', protect, allowRoles('staff', 'superadmin'), getUserAuditLogs);

module.exports = router;
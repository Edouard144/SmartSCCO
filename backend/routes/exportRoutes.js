const express = require('express');
const router = express.Router();
const {
  exportTransactions, exportMembers,
  exportLoans, exportFraudAlerts
} = require('../controllers/exportController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

const adminOnly = [protect, allowRoles('staff', 'superadmin')];

/**
 * @swagger
 * /api/export/transactions:
 *   get:
 *     summary: Export transactions as CSV (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by type (transfer, deposit, withdraw)
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *         description: End date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/transactions', ...adminOnly, exportTransactions);

/**
 * @swagger
 * /api/export/members:
 *   get:
 *     summary: Export all members as CSV (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/members', ...adminOnly, exportMembers);

/**
 * @swagger
 * /api/export/loans:
 *   get:
 *     summary: Export loans as CSV (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, repaid, rejected]
 *         description: Filter by loan status
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/loans', ...adminOnly, exportLoans);

/**
 * @swagger
 * /api/export/fraud-alerts:
 *   get:
 *     summary: Export fraud alerts as CSV (Admin only)
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/fraud-alerts', ...adminOnly, exportFraudAlerts);

module.exports = router;
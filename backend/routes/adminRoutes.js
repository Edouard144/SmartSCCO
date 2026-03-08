const express = require('express');
const router = express.Router();
const {
  getAllMembers, getAllTransactions,
  getDashboardStats, updateKyc,
  searchMembers, suspendUser, unsuspendUser
} = require('../controllers/adminController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

const adminOnly = [protect, allowRoles('staff', 'superadmin')];

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard stats (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total members, deposits, loans, fraud alerts
 */
router.get('/dashboard', ...adminOnly, getDashboardStats);

/**
 * @swagger
 * /api/admin/members:
 *   get:
 *     summary: Get all members (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all members
 */
router.get('/members', ...adminOnly, getAllMembers);

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all transactions
 */
router.get('/transactions', ...adminOnly, getAllTransactions);

/**
 * @swagger
 * /api/admin/search:
 *   get:
 *     summary: Search members by name, email or national ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', ...adminOnly, searchMembers);

/**
 * @swagger
 * /api/admin/kyc/{user_id}:
 *   put:
 *     summary: Approve KYC for a member (Admin only)
 *     tags: [Admin]
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
 *         description: KYC approved
 */
router.put('/kyc/:user_id', ...adminOnly, updateKyc);

/**
 * @swagger
 * /api/admin/suspend/{user_id}:
 *   put:
 *     summary: Suspend a member account (Admin only)
 *     tags: [Admin]
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
 *         description: User suspended
 */
router.put('/suspend/:user_id', ...adminOnly, suspendUser);

/**
 * @swagger
 * /api/admin/unsuspend/{user_id}:
 *   put:
 *     summary: Unsuspend a member account (Admin only)
 *     tags: [Admin]
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
 *         description: User unsuspended
 */
router.put('/unsuspend/:user_id', ...adminOnly, unsuspendUser);

module.exports = router;

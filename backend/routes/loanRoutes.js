const express = require('express');
const router = express.Router();
const {
  applyLoan, getMyLoans, approveLoan,
  rejectLoan, repayLoan, getPendingLoans,
  getRepaymentSchedule, runPenaltyCheck
} = require('../controllers/loanController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

/**
 * @swagger
 * /api/loans/apply:
 *   post:
 *     summary: Apply for a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, duration_months]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100000
 *               duration_months:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       201:
 *         description: Loan application submitted
 */
router.post('/apply', protect, applyLoan);

/**
 * @swagger
 * /api/loans/my-loans:
 *   get:
 *     summary: Get all my loan applications
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of loans
 */
router.get('/my-loans', protect, getMyLoans);

/**
 * @swagger
 * /api/loans/schedule/{loan_id}:
 *   get:
 *     summary: Get repayment schedule for a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loan_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Monthly repayment schedule
 *       404:
 *         description: Loan not found
 */
router.get('/schedule/:loan_id', protect, getRepaymentSchedule);

/**
 * @swagger
 * /api/loans/repay/{loan_id}:
 *   post:
 *     summary: Repay a loan
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loan_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan repaid successfully
 *       400:
 *         description: Insufficient balance
 */
router.post('/repay/:loan_id', protect, repayLoan);

/**
 * @swagger
 * /api/loans/penalty-check:
 *   post:
 *     summary: Manually trigger penalty check (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Penalty check completed
 */
router.post('/penalty-check', protect, allowRoles('staff', 'superadmin'), runPenaltyCheck);

/**
 * @swagger
 * /api/loans/pending:
 *   get:
 *     summary: Get all pending loans (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending loans
 *       403:
 *         description: Access denied
 */
router.get('/pending', protect, allowRoles('staff', 'superadmin'), getPendingLoans);

/**
 * @swagger
 * /api/loans/approve/{loan_id}:
 *   put:
 *     summary: Approve a loan (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loan_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan approved and disbursed
 *       403:
 *         description: Access denied
 */
router.put('/approve/:loan_id', protect, allowRoles('staff', 'superadmin'), approveLoan);

/**
 * @swagger
 * /api/loans/reject/{loan_id}:
 *   put:
 *     summary: Reject a loan (Admin only)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: loan_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Loan rejected
 *       403:
 *         description: Access denied
 */
router.put('/reject/:loan_id', protect, allowRoles('staff', 'superadmin'), rejectLoan);

module.exports = router;
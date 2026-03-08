const express = require('express');
const router = express.Router();
const { getBalance, deposit, withdraw, transfer, getTransactions, getTransactionById } = require('../controllers/walletController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/wallet/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet info returned
 *       404:
 *         description: Wallet not found
 */
router.get('/balance', protect, getBalance);

/**
 * @swagger
 * /api/wallet/deposit:
 *   post:
 *     summary: Deposit money into wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.post('/deposit', protect, deposit);

/**
 * @swagger
 * /api/wallet/withdraw:
 *   post:
 *     summary: Withdraw money from wallet (PIN required)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, pin]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: PIN required or incorrect
 */
router.post('/withdraw', protect, withdraw);

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer money to another member (PIN required)
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiver_id, amount, pin]
 *             properties:
 *               receiver_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 example: 5000
 *               pin:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient balance or daily limit exceeded
 */
router.post('/transfer', protect, transfer);

/**
 * @swagger
 * /api/wallet/transactions:
 *   get:
 *     summary: Get transaction history with optional filters
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, withdraw, transfer, loan_disbursement, repayment]
 *         description: Filter by transaction type
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
 *         description: List of transactions
 */
router.get('/transactions', protect, getTransactions);

/**
 * @swagger
 * /api/wallet/transactions/{transaction_id}:
 *   get:
 *     summary: Get single transaction receipt
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/transactions/:transaction_id', protect, getTransactionById);

module.exports = router;

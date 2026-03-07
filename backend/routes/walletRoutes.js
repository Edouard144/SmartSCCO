const express = require('express');
const router = express.Router();
const { getBalance, deposit, withdraw, transfer, getTransactions, getTransactionById } = require('../controllers/walletController');
const { protect } = require('../utils/authMiddleware');

router.get('/balance', protect, getBalance);
router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);         // requires PIN
router.post('/transfer', protect, transfer);         // requires PIN
router.get('/transactions', protect, getTransactions); // supports filters
router.get('/transactions/:transaction_id', protect, getTransactionById); // Receipt

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  applyLoan, getMyLoans, approveLoan,
  rejectLoan, repayLoan, getPendingLoans,
  getRepaymentSchedule
} = require('../controllers/loanController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

// Member routes
router.post('/apply', protect, applyLoan);
router.get('/my-loans', protect, getMyLoans);
router.post('/repay/:loan_id', protect, repayLoan);
router.get('/schedule/:loan_id', protect, getRepaymentSchedule); // NEW

// Admin routes
router.get('/pending', protect, allowRoles('staff', 'superadmin'), getPendingLoans);
router.put('/approve/:loan_id', protect, allowRoles('staff', 'superadmin'), approveLoan);
router.put('/reject/:loan_id', protect, allowRoles('staff', 'superadmin'), rejectLoan);

module.exports = router;
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

router.get('/members', ...adminOnly, getAllMembers);
router.get('/transactions', ...adminOnly, getAllTransactions);
router.get('/dashboard', ...adminOnly, getDashboardStats);
router.put('/kyc/:user_id', ...adminOnly, updateKyc);
router.get('/search', ...adminOnly, searchMembers);             
router.put('/suspend/:user_id', ...adminOnly, suspendUser);     
router.put('/unsuspend/:user_id', ...adminOnly, unsuspendUser);

module.exports = router;
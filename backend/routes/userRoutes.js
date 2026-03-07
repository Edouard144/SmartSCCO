const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../utils/authMiddleware');

router.get('/profile', protect, getProfile);      // Get my profile
router.put('/profile', protect, updateProfile);   // Update my profile

module.exports = router;
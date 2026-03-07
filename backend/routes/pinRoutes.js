const express = require('express');
const router = express.Router();
const { setPin, verifyPin } = require('../controllers/pinController');
const { protect } = require('../utils/authMiddleware');

router.post('/set', protect, setPin);       // Set a new PIN
router.post('/verify', protect, verifyPin); // Verify PIN before transaction

module.exports = router;
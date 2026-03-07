const express = require('express');
const router = express.Router();
const { getMyDevices } = require('../controllers/deviceController');
const { protect } = require('../utils/authMiddleware');

// Member sees all devices they logged in from
router.get('/my-devices', protect, getMyDevices);

module.exports = router;
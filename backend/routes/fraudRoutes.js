const express = require('express');
const router = express.Router();
const { getMyAlerts, getOpenAlerts, markResolved } = require('../controllers/fraudController');
const { protect } = require('../utils/authMiddleware');
const { allowRoles } = require('../utils/roleMiddleware');

// Member sees their own alerts
router.get('/my-alerts', protect, getMyAlerts);

// Admin only routes
router.get('/open', protect, allowRoles('staff', 'superadmin'), getOpenAlerts);
router.put('/resolve/:alert_id', protect, allowRoles('staff', 'superadmin'), markResolved);

module.exports = router;
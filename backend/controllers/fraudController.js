const { getFraudAlertsByUser, getAllOpenAlerts, resolveAlert } = require('../models/fraudModel');

// Member sees their own fraud alerts
const getMyAlerts = async (req, res) => {
  try {
    const alerts = await getFraudAlertsByUser(req.user.id);
    res.json({ alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin sees all open fraud alerts
const getOpenAlerts = async (req, res) => {
  try {
    const alerts = await getAllOpenAlerts();
    res.json({ alerts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin resolves a fraud alert
const markResolved = async (req, res) => {
  try {
    const { alert_id } = req.params;
    const alert = await resolveAlert(alert_id);
    res.json({ message: 'Alert resolved', alert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyAlerts, getOpenAlerts, markResolved };
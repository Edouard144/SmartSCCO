const { getDevicesByUser } = require('../models/deviceModel');

// Get all devices the user has logged in from
const getMyDevices = async (req, res) => {
  try {
    const devices = await getDevicesByUser(req.user.id);
    res.json({ devices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyDevices };
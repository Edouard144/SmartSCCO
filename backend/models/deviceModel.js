const pool = require('../db');

// Save a new device when user logs in
const saveDevice = async (user_id, device_name, ip_address) => {
  const result = await pool.query(
    `INSERT INTO devices (user_id, device_name, ip_address, last_login)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [user_id, device_name, ip_address]
  );
  return result.rows[0];
};

// Check if this device already logged in before
const findDevice = async (user_id, ip_address) => {
  const result = await pool.query(
    `SELECT * FROM devices WHERE user_id = $1 AND ip_address = $2`,
    [user_id, ip_address]
  );
  return result.rows[0];
};

// Update last login time for known device
const updateLastLogin = async (device_id) => {
  await pool.query(
    `UPDATE devices SET last_login = NOW() WHERE device_id = $1`,
    [device_id]
  );
};

// Get all devices for a user
const getDevicesByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM devices WHERE user_id = $1 ORDER BY last_login DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = { saveDevice, findDevice, updateLastLogin, getDevicesByUser };
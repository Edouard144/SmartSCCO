const pool = require('../db');

// Call this after every important admin or user action
const logAction = async (user_id, action, target_id, target_type, details, ip_address) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, target_id, target_type, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, action, target_id, target_type, details, ip_address]
    );
  } catch (error) {
    // Never crash the app because of audit log failure
    console.error('Audit log error:', error);
  }
};

module.exports = { logAction };
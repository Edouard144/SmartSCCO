const pool = require('../db');

// Get all fraud alerts for a specific user
const getFraudAlertsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM fraud_alerts WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get all open fraud alerts (for admin)
const getAllOpenAlerts = async () => {
  const result = await pool.query(
    `SELECT fraud_alerts.*, users.full_name, users.email 
     FROM fraud_alerts 
     JOIN users ON fraud_alerts.user_id = users.id
     WHERE fraud_alerts.status = 'open'
     ORDER BY fraud_alerts.created_at DESC`
  );
  return result.rows;
};

// Mark a fraud alert as resolved (admin action)
const resolveAlert = async (alert_id) => {
  const result = await pool.query(
    `UPDATE fraud_alerts SET status = 'resolved' WHERE alert_id = $1 RETURNING *`,
    [alert_id]
  );
  return result.rows[0];
};

module.exports = { getFraudAlertsByUser, getAllOpenAlerts, resolveAlert };
const pool = require('../db');

// Get all audit logs (admin only)
const getAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT audit_logs.*, users.full_name, users.email
       FROM audit_logs
       JOIN users ON audit_logs.user_id = users.id
       ORDER BY audit_logs.created_at DESC
       LIMIT 100` // Last 100 actions
    );
    res.json({ logs: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get audit logs for a specific user (admin only)
const getUserAuditLogs = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT * FROM audit_logs WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user_id]
    );
    res.json({ logs: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAuditLogs, getUserAuditLogs };
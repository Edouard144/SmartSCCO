const pool = require('../db');
const { logAction } = require('../utils/auditLogger');
const { notify } = require('../utils/notifier');

const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, national_id, phone, email, role, kyc_status, created_at
       FROM users ORDER BY created_at DESC`
    );
    res.json({ members: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM transactions ORDER BY created_at DESC`
    );
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const members = await pool.query(`SELECT COUNT(*) FROM users WHERE role = 'member'`);
    const deposits = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'deposit'`
    );
    const loans = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'loan_disbursement'`
    );
    const fraudAlerts = await pool.query(
      `SELECT COUNT(*) FROM fraud_alerts WHERE status = 'open'`
    );

    res.json({
      stats: {
        total_members: parseInt(members.rows[0].count),
        total_deposits: parseFloat(deposits.rows[0].total),
        total_loans_disbursed: parseFloat(loans.rows[0].total),
        open_fraud_alerts: parseInt(fraudAlerts.rows[0].count)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateKyc = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `UPDATE users SET kyc_status = TRUE WHERE id = $1
       RETURNING id, full_name, kyc_status`,
      [user_id]
    );

    // Log this admin action
    await logAction(
      req.user.id, 'KYC_APPROVED',
      user_id, 'user',
      `KYC approved for user ${user_id}`,
      req.ip
    );

    res.json({ message: 'KYC approved', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// SEARCH MEMBERS — find by name, email or national ID
const searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const result = await pool.query(
      `SELECT id, full_name, national_id, phone, email, role, kyc_status
       FROM users
       WHERE full_name ILIKE $1
       OR email ILIKE $1
       OR national_id ILIKE $1`,
      [`%${query}%`] // % means match anywhere in the string
    );

    res.json({ results: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// SUSPEND USER — block a suspicious member
const suspendUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `UPDATE wallets SET status = 'suspended' WHERE user_id = $1 RETURNING *`,
      [user_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User wallet not found' });
    }

    // Log suspension
    await logAction(
      req.user.id, 'USER_SUSPENDED',
      user_id, 'user',
      `User ${user_id} suspended`,
      req.ip
    );

    await pool.query(
      `INSERT INTO fraud_alerts (user_id, alert_type, severity, status)
       VALUES ($1, 'account_suspended', 'high', 'resolved')`,
      [user_id]
    );

    res.json({ message: 'User suspended successfully', wallet: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

  await notify(
    user_id,
    'Account Suspended',
    'Your account has been suspended. Contact support for help.',
    'security'
  );
};

// UNSUSPEND USER — restore a suspended member
const unsuspendUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `UPDATE wallets SET status = 'active' WHERE user_id = $1 RETURNING *`,
      [user_id]
    );

    // Log unsuspension
    await logAction(
      req.user.id, 'USER_UNSUSPENDED',
      user_id, 'user',
      `User ${user_id} unsuspended`,
      req.ip
    );

    res.json({ message: 'User unsuspended successfully', wallet: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

  await notify(
    user_id,
    'Account Restored',
    'Your account has been restored. You can now transact normally.',
    'security'
  );
};

module.exports = {
  getAllMembers, getAllTransactions,
  getDashboardStats, updateKyc,
  searchMembers, suspendUser, unsuspendUser
};
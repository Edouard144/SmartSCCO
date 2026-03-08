const pool = require('../db');
const { logAction } = require('../utils/auditLogger');

// Helper — converts array of objects to CSV string
const toCSV = (rows) => {
  if (rows.length === 0) return 'No data found';

  // Get headers from first row keys
  const headers = Object.keys(rows[0]);
  const csvHeaders = headers.join(',');

  // Convert each row to CSV line
  const csvRows = rows.map(row =>
    headers.map(header => {
      const value = row[header];
      // Wrap in quotes if value contains comma or newline
      if (value === null || value === undefined) return '';
      const str = String(value);
      return str.includes(',') || str.includes('\n') ? `"${str}"` : str;
    }).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};

// EXPORT TRANSACTIONS
const exportTransactions = async (req, res) => {
  try {
    const { from, to, type } = req.query;

    let query = `
      SELECT
        t.transaction_id, t.type, t.amount, t.status,
        t.reference, t.created_at,
        sw.user_id as sender_id, rw.user_id as receiver_id,
        t.is_reversed
      FROM transactions t
      LEFT JOIN wallets sw ON t.sender_wallet = sw.wallet_id
      LEFT JOIN wallets rw ON t.receiver_wallet = rw.wallet_id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND t.type = $${params.length}`;
    }
    if (from) {
      params.push(from);
      query += ` AND t.created_at >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      query += ` AND t.created_at <= $${params.length}`;
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await pool.query(query, params);

    // Log export action
    await logAction(
      req.user.id, 'EXPORT_TRANSACTIONS',
      null, 'report',
      `Exported ${result.rows.length} transactions`,
      req.ip
    );

    // Set headers so browser downloads as file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(toCSV(result.rows));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// EXPORT MEMBERS
const exportMembers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id, u.full_name, u.email, u.phone,
         u.national_id, u.role, u.kyc_status,
         u.credit_score, u.created_at,
         b.name as branch_name,
         w.balance as wallet_balance
       FROM users u
       LEFT JOIN branches b ON u.branch_id = b.branch_id
       LEFT JOIN wallets w ON u.id = w.user_id
       ORDER BY u.created_at DESC`
    );

    await logAction(
      req.user.id, 'EXPORT_MEMBERS',
      null, 'report',
      `Exported ${result.rows.length} members`,
      req.ip
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
    res.send(toCSV(result.rows));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// EXPORT LOANS
const exportLoans = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT
        l.loan_id, u.full_name as member_name, u.email,
        l.amount, l.interest_rate, l.duration_months,
        l.status, l.amount_paid, l.penalty_amount,
        l.due_date, l.created_at
      FROM loans l
      JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND l.status = $${params.length}`;
    }

    query += ` ORDER BY l.created_at DESC`;

    const result = await pool.query(query, params);

    await logAction(
      req.user.id, 'EXPORT_LOANS',
      null, 'report',
      `Exported ${result.rows.length} loans`,
      req.ip
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=loans.csv');
    res.send(toCSV(result.rows));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// EXPORT FRAUD ALERTS
const exportFraudAlerts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         f.alert_id, u.full_name as member_name, u.email,
         f.alert_type, f.severity, f.status, f.created_at
       FROM fraud_alerts f
       JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );

    await logAction(
      req.user.id, 'EXPORT_FRAUD_ALERTS',
      null, 'report',
      `Exported ${result.rows.length} fraud alerts`,
      req.ip
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=fraud_alerts.csv');
    res.send(toCSV(result.rows));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { exportTransactions, exportMembers, exportLoans, exportFraudAlerts };
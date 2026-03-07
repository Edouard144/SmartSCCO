const pool = require('../db');

// Save a fraud alert to the database
const createFraudAlert = async (user_id, alert_type, severity) => {
  await pool.query(
    `INSERT INTO fraud_alerts (user_id, alert_type, severity)
     VALUES ($1, $2, $3)`,
    [user_id, alert_type, severity]
  );
};

// Main fraud checker — runs before every transaction
const checkFraud = async (user_id, amount, type) => {
  const alerts = [];
  const numAmount = parseFloat(amount); // Always parse to number

  // RULE 1 — Large amount over 500,000 RWF
  if (numAmount > 500000) {
    await createFraudAlert(user_id, 'large_transfer', 'high');
    alerts.push('Large transfer detected');
  }

  // RULE 2 — More than 5 transactions in last 10 minutes
  const recentTx = await pool.query(
    `SELECT COUNT(*) FROM transactions 
     WHERE sender_wallet IN (SELECT wallet_id FROM wallets WHERE user_id = $1)
     AND created_at > NOW() - INTERVAL '10 minutes'`,
    [user_id]
  );
  if (parseInt(recentTx.rows[0].count) >= 5) {
    await createFraudAlert(user_id, 'rapid_transactions', 'medium');
    alerts.push('Too many transactions in short time');
  }

  // RULE 3 — Large withdrawal over 300,000 RWF
  if (type === 'withdraw' && numAmount > 300000) {
    await createFraudAlert(user_id, 'large_withdrawal', 'high');
    alerts.push('Large withdrawal detected');
  }

  return alerts;
};

module.exports = { checkFraud };
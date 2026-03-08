const pool = require('../db');

// Calculate and save credit score for a user
const calculateCreditScore = async (user_id) => {
  let score = 0;
  const reasons = [];

  // 1. Check if user has fully repaid at least one loan (+30)
  const repaidLoans = await pool.query(
    `SELECT COUNT(*) as count FROM loans
     WHERE user_id = $1 AND status = 'repaid'`,
    [user_id]
  );
  if (parseInt(repaidLoans.rows[0].count) > 0) {
    score += 30;
    reasons.push('+30: Has repaid loans');
  }

  // 2. Check for open fraud alerts (-20 if any)
  const fraudAlerts = await pool.query(
    `SELECT COUNT(*) as count FROM fraud_alerts
     WHERE user_id = $1 AND status = 'open'`,
    [user_id]
  );
  if (parseInt(fraudAlerts.rows[0].count) === 0) {
    score += 20;
    reasons.push('+20: No open fraud alerts');
  } else {
    reasons.push('+0: Has open fraud alerts');
  }

  // 3. Check KYC status (+20)
  const kycResult = await pool.query(
    `SELECT kyc_status FROM users WHERE id = $1`,
    [user_id]
  );
  if (kycResult.rows[0]?.kyc_status) {
    score += 20;
    reasons.push('+20: KYC verified');
  } else {
    reasons.push('+0: KYC not verified');
  }

  // 4. Check account age (+15 if older than 30 days)
  const ageResult = await pool.query(
    `SELECT created_at FROM users WHERE id = $1`,
    [user_id]
  );
  const createdAt = new Date(ageResult.rows[0]?.created_at);
  const daysSinceCreation = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
  if (daysSinceCreation >= 30) {
    score += 15;
    reasons.push('+15: Account older than 30 days');
  } else {
    reasons.push(`+0: Account only ${Math.floor(daysSinceCreation)} days old`);
  }

  // 5. Check savings balance (+10 if > 10,000 RWF)
  const balanceResult = await pool.query(
    `SELECT balance FROM wallets WHERE user_id = $1`,
    [user_id]
  );
  if (parseFloat(balanceResult.rows[0]?.balance) > 10000) {
    score += 10;
    reasons.push('+10: Balance above 10,000 RWF');
  } else {
    reasons.push('+0: Balance below 10,000 RWF');
  }

  // 6. Check for defaulted loans (+5 if none)
  const defaultedLoans = await pool.query(
    `SELECT COUNT(*) as count FROM loans
     WHERE user_id = $1 AND status = 'defaulted'`,
    [user_id]
  );
  if (parseInt(defaultedLoans.rows[0].count) === 0) {
    score += 5;
    reasons.push('+5: No defaulted loans');
  } else {
    reasons.push('+0: Has defaulted loans');
  }

  // Save score to DB
  await pool.query(
    `UPDATE users SET credit_score = $1, credit_score_updated_at = NOW()
     WHERE id = $2`,
    [score, user_id]
  );

  return { score, reasons };
};

module.exports = { calculateCreditScore };
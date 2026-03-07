const pool = require('../db');

// Save a new loan application
const createLoan = async ({ user_id, amount, interest_rate, duration_months }) => {
  const result = await pool.query(
    `INSERT INTO loans (user_id, amount, interest_rate, duration_months)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, amount, interest_rate, duration_months]
  );
  return result.rows[0];
};

// Get all loans for a specific user
const getLoansByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get a single loan by its id
const getLoanById = async (loan_id) => {
  const result = await pool.query(
    `SELECT * FROM loans WHERE loan_id = $1`,
    [loan_id]
  );
  return result.rows[0];
};

// Update loan status (pending → approved / rejected / repaid)
const updateLoanStatus = async (loan_id, status, approved_by) => {
  const result = await pool.query(
    `UPDATE loans SET status = $1, approved_by = $2 WHERE loan_id = $3 RETURNING *`,
    [status, approved_by, loan_id]
  );
  return result.rows[0];
};

// Get all pending loans (for admin)
const getAllPendingLoans = async () => {
  const result = await pool.query(
    `SELECT * FROM loans WHERE status = 'pending' ORDER BY created_at ASC`
  );
  return result.rows;
};

module.exports = { createLoan, getLoansByUser, getLoanById, updateLoanStatus, getAllPendingLoans };
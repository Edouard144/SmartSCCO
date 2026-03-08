const pool = require('../db');

// Save a new beneficiary
const addBeneficiary = async (user_id, beneficiary_user_id, nickname) => {
  const result = await pool.query(
    `INSERT INTO beneficiaries (user_id, beneficiary_user_id, nickname)
     VALUES ($1, $2, $3) RETURNING *`,
    [user_id, beneficiary_user_id, nickname]
  );
  return result.rows[0];
};

// Get all beneficiaries for a user
const getBeneficiaries = async (user_id) => {
  const result = await pool.query(
    `SELECT b.beneficiary_id, b.nickname, b.created_at,
            u.full_name, u.phone, u.email
     FROM beneficiaries b
     JOIN users u ON b.beneficiary_user_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Delete a beneficiary
const removeBeneficiary = async (beneficiary_id, user_id) => {
  const result = await pool.query(
    `DELETE FROM beneficiaries
     WHERE beneficiary_id = $1 AND user_id = $2
     RETURNING *`,
    [beneficiary_id, user_id]
  );
  return result.rows[0];
};

module.exports = { addBeneficiary, getBeneficiaries, removeBeneficiary };
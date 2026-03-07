const pool = require('../db');

// Create a wallet for a newly registered user
const createWallet = async (user_id) => {
  const result = await pool.query(
    `INSERT INTO wallets (user_id) VALUES ($1) RETURNING *`,
    [user_id]
  );
  return result.rows[0];
};

// Get wallet by user_id
const getWalletByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM wallets WHERE user_id = $1`,
    [user_id]
  );
  return result.rows[0];
};

// Update wallet balance (add or subtract)
const updateBalance = async (wallet_id, new_balance) => {
  const result = await pool.query(
    `UPDATE wallets SET balance = $1 WHERE wallet_id = $2 RETURNING *`,
    [new_balance, wallet_id]
  );
  return result.rows[0];
};

module.exports = { createWallet, getWalletByUserId, updateBalance };
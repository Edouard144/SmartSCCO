const pool = require('../db');

// Record every money movement in the transactions table
const createTransaction = async ({ sender_wallet, receiver_wallet, amount, type, reference }) => {
  const result = await pool.query(
    `INSERT INTO transactions (sender_wallet, receiver_wallet, amount, type, reference)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [sender_wallet, receiver_wallet, amount, type, reference]
  );
  return result.rows[0];
};

// Get all transactions for a specific wallet
const getTransactionsByWallet = async (wallet_id) => {
  const result = await pool.query(
    `SELECT * FROM transactions 
     WHERE sender_wallet = $1 OR receiver_wallet = $1
     ORDER BY created_at DESC`,
    [wallet_id]
  );
  return result.rows;
};

module.exports = { createTransaction, getTransactionsByWallet };
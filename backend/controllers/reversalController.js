const pool = require('../db');
const { notify } = require('../utils/notifier');
const { logAction } = require('../utils/auditLogger');

// REVERSE A TRANSACTION — admin only
const reverseTransaction = async (req, res) => {
  const client = await pool.connect(); // Use transaction to ensure both updates succeed or fail together
  try {
    const { transaction_id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ error: 'Reversal reason is required' });
    }

    // Get the transaction
    const txResult = await client.query(
      `SELECT * FROM transactions WHERE transaction_id = $1`,
      [transaction_id]
    );
    const tx = txResult.rows[0];

    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Only transfer transactions can be reversed
    if (tx.type !== 'transfer') {
      return res.status(400).json({ error: 'Only transfer transactions can be reversed' });
    }

    // Cannot reverse already reversed transaction
    if (tx.is_reversed) {
      return res.status(400).json({ error: 'Transaction already reversed' });
    }

    const amount = parseFloat(tx.amount);

    // Get sender and receiver wallets
    const senderWalletResult = await client.query(
      `SELECT * FROM wallets WHERE wallet_id = $1`, [tx.sender_wallet]
    );
    const receiverWalletResult = await client.query(
      `SELECT * FROM wallets WHERE wallet_id = $1`, [tx.receiver_wallet]
    );

    const senderWallet = senderWalletResult.rows[0];
    const receiverWallet = receiverWalletResult.rows[0];

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Check receiver has enough balance to reverse
    if (parseFloat(receiverWallet.balance) < amount) {
      return res.status(400).json({ error: 'Receiver has insufficient balance for reversal' });
    }

    // Start DB transaction — all or nothing
    await client.query('BEGIN');

    // Deduct from receiver
    await client.query(
      `UPDATE wallets SET balance = balance - $1 WHERE wallet_id = $2`,
      [amount, receiverWallet.wallet_id]
    );

    // Refund to sender
    await client.query(
      `UPDATE wallets SET balance = balance + $1 WHERE wallet_id = $2`,
      [amount, senderWallet.wallet_id]
    );

    // Mark original transaction as reversed
    await client.query(
      `UPDATE transactions
       SET is_reversed = TRUE, reversed_at = NOW(), reversed_by = $1
       WHERE transaction_id = $2`,
      [req.user.id, transaction_id]
    );

    // Create a new reversal transaction record
    await client.query(
      `INSERT INTO transactions
       (sender_wallet, receiver_wallet, amount, type, reference)
       VALUES ($1, $2, $3, 'reversal', $4)`,
      [
        receiverWallet.wallet_id,
        senderWallet.wallet_id,
        amount,
        `REV-${transaction_id}-${Date.now()}`
      ]
    );

    // Commit everything
    await client.query('COMMIT');

    // Log admin action
    await logAction(
      req.user.id, 'TRANSACTION_REVERSED',
      transaction_id, 'transaction',
      `Transaction ${transaction_id} reversed. Reason: ${reason}`,
      req.ip
    );

    // Notify both users
    await notify(
      senderWallet.user_id,
      'Transfer Reversed',
      `Your transfer of ${amount} RWF has been reversed. Reason: ${reason}`,
      'transfer'
    );
    await notify(
      receiverWallet.user_id,
      'Transfer Reversed',
      `A transfer of ${amount} RWF has been reversed from your wallet. Reason: ${reason}`,
      'transfer'
    );

    res.json({
      message: 'Transaction reversed successfully',
      transaction_id,
      amount,
      reason
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Undo everything if anything fails
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release(); // Always release DB connection
  }
};

// GET ALL REVERSALS — admin only
const getReversals = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.full_name as reversed_by_name
       FROM transactions t
       LEFT JOIN users u ON t.reversed_by = u.id
       WHERE t.is_reversed = TRUE
       ORDER BY t.reversed_at DESC`
    );
    res.json({ reversals: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { reverseTransaction, getReversals };
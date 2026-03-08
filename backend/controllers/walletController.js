const { getWalletByUserId, updateBalance } = require('../models/walletModel');
const { createTransaction, getTransactionsByWallet } = require('../models/transactionModel');
const { checkFraud } = require('../utils/fraudChecker');
const { validateAmount, validateTransfer } = require('../utils/validators');
const { getUserPin } = require('../models/userModel');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { notify } = require('../utils/notifier');

const getBalance = async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.user.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    res.json({ wallet });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deposit = async (req, res) => {
  try {
    const { error } = validateAmount(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount } = req.body;
    const wallet = await getWalletByUserId(req.user.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    const fraudAlerts = await checkFraud(req.user.id, amount, 'deposit');
    const new_balance = parseFloat(wallet.balance) + parseFloat(amount);
    await updateBalance(wallet.wallet_id, new_balance);

    await createTransaction({
      sender_wallet: null,
      receiver_wallet: wallet.wallet_id,
      amount,
      type: 'deposit',
      reference: `DEP-${Date.now()}`
    });

    await notify(
      req.user.id,
      'Deposit Successful',
      `${amount} RWF deposited to your wallet.`,
      'transfer'
    );

    res.json({
      message: 'Deposit successful',
      balance: new_balance,
      warnings: fraudAlerts.length > 0 ? fraudAlerts : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const withdraw = async (req, res) => {
  try {
    const { amount, pin } = req.body;

    const { error } = validateAmount({ amount });
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (!pin) return res.status(400).json({ error: 'PIN required for withdrawal' });

    // Verify PIN
    const userPin = await getUserPin(req.user.id);
    if (!userPin || !userPin.pin_hash) {
      return res.status(400).json({ error: 'No PIN set. Please set your PIN first.' });
    }
    const pinMatch = await bcrypt.compare(pin, userPin.pin_hash);
    if (!pinMatch) return res.status(400).json({ error: 'Incorrect PIN' });

    const wallet = await getWalletByUserId(req.user.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const fraudAlerts = await checkFraud(req.user.id, amount, 'withdraw');
    const new_balance = parseFloat(wallet.balance) - parseFloat(amount);
    await updateBalance(wallet.wallet_id, new_balance);

    await createTransaction({
      sender_wallet: wallet.wallet_id,
      receiver_wallet: null,
      amount,
      type: 'withdraw',
      reference: `WIT-${Date.now()}`
    });

    await notify(
      req.user.id,
      'Withdrawal Successful',
      `${amount} RWF withdrawn from your wallet.`,
      'transfer'
    );

    res.json({
      message: 'Withdrawal successful',
      balance: new_balance,
      warnings: fraudAlerts.length > 0 ? fraudAlerts : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

};

const transfer = async (req, res) => {
  try {
    const { receiver_id, amount, pin } = req.body;

    const { error } = validateTransfer({ receiver_id, amount });
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (!pin) return res.status(400).json({ error: 'PIN required for transfer' });

    // Verify PIN
    const userPin = await getUserPin(req.user.id);
    if (!userPin || !userPin.pin_hash) {
      return res.status(400).json({ error: 'No PIN set. Please set your PIN first.' });
    }
    const pinMatch = await bcrypt.compare(pin, userPin.pin_hash);
    if (!pinMatch) return res.status(400).json({ error: 'Incorrect PIN' });

    const senderWallet = await getWalletByUserId(req.user.id);
    const receiverWallet = await getWalletByUserId(receiver_id);

    if (!senderWallet) return res.status(404).json({ error: 'Your wallet not found' });
    if (!receiverWallet) return res.status(404).json({ error: 'Receiver wallet not found' });

    if (parseFloat(senderWallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // DAILY LIMIT CHECK — max 1,000,000 RWF per day
    const DAILY_LIMIT = 1000000;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Always fetch fresh wallet data directly from DB
    const freshWalletData = await pool.query(
      `SELECT daily_transfer_total, daily_transfer_date FROM wallets WHERE wallet_id = $1`,
      [senderWallet.wallet_id]
    );
    const freshData = freshWalletData.rows[0];

// Compare using local date
const savedDate = freshData.daily_transfer_date
  ? (() => {
      const d = new Date(freshData.daily_transfer_date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })()
  : null;

  console.log(`Today: ${today}, Saved: ${savedDate}, Total: ${freshData.daily_transfer_total}`);

    // Reset if new day
    if (!savedDate || savedDate !== today) {
      await pool.query(
        `UPDATE wallets SET daily_transfer_total = 0, daily_transfer_date = $1
         WHERE wallet_id = $2`,
        [today, senderWallet.wallet_id]
      );
      freshData.daily_transfer_total = 0;
    }

    const currentDailyTotal = parseFloat(freshData.daily_transfer_total);
    const newDailyTotal = currentDailyTotal + parseFloat(amount);

    // Block if limit exceeded
    if (newDailyTotal > DAILY_LIMIT) {
      const remaining = DAILY_LIMIT - currentDailyTotal;
      return res.status(400).json({
        error: `Daily transfer limit exceeded. You can only transfer ${remaining} RWF more today.`
      });
    }

    // Run fraud check
    const fraudAlerts = await checkFraud(req.user.id, amount, 'transfer');

    // Deduct from sender
    const sender_new_balance = parseFloat(senderWallet.balance) - parseFloat(amount);
    await updateBalance(senderWallet.wallet_id, sender_new_balance);

    // Add to receiver
    const receiver_new_balance = parseFloat(receiverWallet.balance) + parseFloat(amount);
    await updateBalance(receiverWallet.wallet_id, receiver_new_balance);

    // Save updated daily total
    await pool.query(
      `UPDATE wallets SET daily_transfer_total = $1, daily_transfer_date = $2
       WHERE wallet_id = $3`,
      [newDailyTotal, today, senderWallet.wallet_id]
    );

    await createTransaction({
      sender_wallet: senderWallet.wallet_id,
      receiver_wallet: receiverWallet.wallet_id,
      amount,
      type: 'transfer',
      reference: `TRF-${Date.now()}`
    });

     await notify(
      req.user.id,
      'Transfer Sent',
      `You sent ${amount} RWF successfully.`,
      'transfer'
     );
      await notify(
      receiverWallet.user_id,
      'Money Received',
      `You received ${amount} RWF in your wallet.`,
      'transfer'
    );

    res.json({
      message: 'Transfer successful',
      new_balance: sender_new_balance,
      daily_transfer_total: newDailyTotal,
      daily_limit_remaining: DAILY_LIMIT - newDailyTotal,
      warnings: fraudAlerts.length > 0 ? fraudAlerts : undefined
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET TRANSACTIONS — filter by type and date
const getTransactions = async (req, res) => {
  try {
    const wallet = await getWalletByUserId(req.user.id);
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    const { type, from, to } = req.query;

    let query = `
      SELECT * FROM transactions
      WHERE (sender_wallet = $1 OR receiver_wallet = $1)
    `;
    const params = [wallet.wallet_id];

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    if (from) {
      params.push(from);
      query += ` AND created_at >= $${params.length}`;
    }
    if (to) {
      params.push(to);
      query += ` AND created_at <= $${params.length}`;
    }

    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, params);
    res.json({ transactions: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET SINGLE TRANSACTION — receipt by ID
const getTransactionById = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const wallet = await getWalletByUserId(req.user.id);

    const result = await pool.query(
      `SELECT * FROM transactions
       WHERE transaction_id = $1
       AND (sender_wallet = $2 OR receiver_wallet = $2)`,
      [transaction_id, wallet.wallet_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBalance, deposit, withdraw,
  transfer, getTransactions, getTransactionById
};
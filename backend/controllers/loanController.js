const pool = require('../db');
const { createLoan, getLoansByUser, getLoanById, updateLoanStatus, getAllPendingLoans } = require('../models/loanModel');
const { getWalletByUserId, updateBalance } = require('../models/walletModel');
const { createTransaction } = require('../models/transactionModel');
const { logAction } = require('../utils/auditLogger');
const { notify } = require('../utils/notifier');
const { applyPenalties } = require('../utils/penaltyChecker');

// APPLY FOR LOAN — member submits a loan request
const applyLoan = async (req, res) => {
  try {
    const { amount, duration_months } = req.body;
    if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    // Fixed interest rate of 10% for all loans
    const interest_rate = 10;

    const loan = await createLoan({
      user_id: req.user.id,
      amount,
      interest_rate,
      duration_months
    });

    res.status(201).json({ message: 'Loan application submitted', loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET MY LOANS — member sees all their loan applications
const getMyLoans = async (req, res) => {
  try {
    const loans = await getLoansByUser(req.user.id);
    res.json({ loans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// APPROVE LOAN — admin approves and money is sent to member wallet
const approveLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;

    const loan = await getLoanById(loan_id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'pending') return res.status(400).json({ error: 'Loan already processed' });

    // Update loan status to approved
    const updated = await updateLoanStatus(loan_id, 'approved', req.user.id);

    // Disburse loan amount into member's wallet
    const wallet = await getWalletByUserId(loan.user_id);
    const new_balance = parseFloat(wallet.balance) + parseFloat(loan.amount);
    await updateBalance(wallet.wallet_id, new_balance);

    // Record disbursement as a transaction
    await createTransaction({
      sender_wallet: null,
      receiver_wallet: wallet.wallet_id,
      amount: loan.amount,
      type: 'loan_disbursement',
      reference: `LOAN-${Date.now()}`
    });

    res.json({ message: 'Loan approved and disbursed', loan: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

  await logAction(
    req.user.id, 'LOAN_APPROVED',
    loan_id, 'loan',
    `Loan ${loan_id} approved for user ${loan.user_id}`,
    req.ip
  );

  await notify(
    loan.user_id,
    'Loan Approved',
    `Your loan of ${loan.amount} RWF has been approved and disbursed to your wallet.`,
    'loan'
  );
};

// REJECT LOAN — admin rejects a loan application
const rejectLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;

    const loan = await getLoanById(loan_id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'pending') return res.status(400).json({ error: 'Loan already processed' });

    const updated = await updateLoanStatus(loan_id, 'rejected', req.user.id);
    res.json({ message: 'Loan rejected', loan: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
  await logAction(
    req.user.id, 'LOAN_REJECTED',
    loan_id, 'loan',
    `Loan ${loan_id} rejected for user ${loan.user_id}`,
    req.ip
  );

  await notify(
    loan.user_id,
    'Loan Rejected',
    `Your loan application of ${loan.amount} RWF has been rejected.`,
    'loan'
  );
};

// REPAY LOAN — member repays their loan from wallet
// REPAY LOAN — supports partial repayment
const repayLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount } = req.body; // amount to repay this time

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid repayment amount required' });
    }

    // Get loan
    const loanResult = await pool.query(
      `SELECT * FROM loans WHERE loan_id = $1 AND user_id = $2`,
      [loan_id, req.user.id]
    );
    const loan = loanResult.rows[0];

    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status === 'repaid') return res.status(400).json({ error: 'Loan already fully repaid' });
    if (loan.status !== 'approved') return res.status(400).json({ error: 'Loan is not active' });

    // Calculate total owed including penalty
    const totalOwed = parseFloat(loan.amount) +
                      parseFloat(loan.interest_amount || 0) +
                      parseFloat(loan.penalty_amount || 0) -
                      parseFloat(loan.amount_paid || 0);

    if (parseFloat(amount) > totalOwed) {
      return res.status(400).json({
        error: `Amount exceeds total owed. You only owe ${totalOwed.toFixed(2)} RWF`
      });
    }

    // Get wallet
    const walletResult = await pool.query(
      `SELECT * FROM wallets WHERE user_id = $1`, [req.user.id]
    );
    const wallet = walletResult.rows[0];

    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Deduct from wallet
    const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
    await pool.query(
      `UPDATE wallets SET balance = $1 WHERE wallet_id = $2`,
      [newBalance, wallet.wallet_id]
    );

    // Update amount paid
    const newAmountPaid = parseFloat(loan.amount_paid || 0) + parseFloat(amount);
    const remainingBalance = totalOwed - parseFloat(amount);

    // Check if fully repaid
    const isFullyRepaid = remainingBalance <= 0;

    await pool.query(
      `UPDATE loans
       SET amount_paid = $1,
           status = $2
       WHERE loan_id = $3`,
      [newAmountPaid, isFullyRepaid ? 'repaid' : 'approved', loan_id]
    );

    // Record transaction
    await pool.query(
      `INSERT INTO transactions (sender_wallet, receiver_wallet, amount, type, reference)
       VALUES ($1, $2, $3, 'repayment', $4)`,
      [wallet.wallet_id, null, amount, `REP-${loan_id}-${Date.now()}`]
    );

    // Notify user
    await notify(
      req.user.id,
      isFullyRepaid ? 'Loan Fully Repaid' : 'Loan Partial Repayment',
      isFullyRepaid
        ? `Congratulations! You have fully repaid your loan of ${loan.amount} RWF.`
        : `You paid ${amount} RWF. Remaining balance: ${remainingBalance.toFixed(2)} RWF.`,
      'loan'
    );

    res.json({
      message: isFullyRepaid ? 'Loan fully repaid' : 'Partial repayment successful',
      amount_paid_now: parseFloat(amount),
      total_amount_paid: newAmountPaid,
      remaining_balance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
      loan_status: isFullyRepaid ? 'repaid' : 'approved',
      new_wallet_balance: newBalance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ALL PENDING LOANS — admin sees all pending applications
const getPendingLoans = async (req, res) => {
  try {
    const loans = await getAllPendingLoans();
    res.json({ loans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// REPAYMENT SCHEDULE — shows monthly breakdown of a loan
const getRepaymentSchedule = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const loan = await getLoanById(loan_id);

    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.user_id !== req.user.id) return res.status(403).json({ error: 'Not your loan' });

    const principal = parseFloat(loan.amount);
    const rate = parseFloat(loan.interest_rate) / 100;
    const months = parseInt(loan.duration_months);

    // Total repayment = principal + interest
    const totalRepayment = principal * (1 + rate);

    // Monthly installment
    const monthlyPayment = totalRepayment / months;

    // Build schedule — one entry per month
    const schedule = [];
    for (let i = 1; i <= months; i++) {
      schedule.push({
        month: i,
        payment: monthlyPayment.toFixed(2),
        due_date: new Date(
          new Date(loan.created_at).setMonth(
            new Date(loan.created_at).getMonth() + i
          )
        ).toISOString().split('T')[0] // Format as YYYY-MM-DD
      });
    }

    res.json({
      loan_id: loan.loan_id,
      principal,
      interest_rate: loan.interest_rate,
      duration_months: months,
      total_repayment: totalRepayment.toFixed(2),
      monthly_payment: monthlyPayment.toFixed(2),
      schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// TRIGGER PENALTY CHECK — admin only (in production this runs on a schedule)
const runPenaltyCheck = async (req, res) => {
  try {
    await applyPenalties();
    res.json({ message: 'Penalty check completed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = { applyLoan, getMyLoans, approveLoan, rejectLoan, repayLoan, getPendingLoans, getRepaymentSchedule, runPenaltyCheck };
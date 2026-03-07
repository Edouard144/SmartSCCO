const { createLoan, getLoansByUser, getLoanById, updateLoanStatus, getAllPendingLoans } = require('../models/loanModel');
const { getWalletByUserId, updateBalance } = require('../models/walletModel');
const { createTransaction } = require('../models/transactionModel');

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
};

// REPAY LOAN — member repays their loan from wallet
const repayLoan = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const loan = await getLoanById(loan_id);

    if (!loan) return res.status(404).json({ error: 'Loan not found' });
    if (loan.status !== 'approved') return res.status(400).json({ error: 'Loan not active' });

    const wallet = await getWalletByUserId(req.user.id);

    // Total repayment = amount + 10% interest
    const totalRepayment = parseFloat(loan.amount) * 1.10;

    if (parseFloat(wallet.balance) < totalRepayment) {
      return res.status(400).json({ error: 'Insufficient balance for repayment' });
    }

    // Deduct repayment from wallet
    const new_balance = parseFloat(wallet.balance) - totalRepayment;
    await updateBalance(wallet.wallet_id, new_balance);

    // Mark loan as repaid
    const updated = await updateLoanStatus(loan_id, 'repaid', null);

    // Record repayment as a transaction
    await createTransaction({
      sender_wallet: wallet.wallet_id,
      receiver_wallet: null,
      amount: totalRepayment,
      type: 'repayment',
      reference: `REP-${Date.now()}`
    });

    res.json({ message: 'Loan repaid successfully', loan: updated });
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

module.exports = { applyLoan, getMyLoans, approveLoan, rejectLoan, repayLoan, getPendingLoans, getRepaymentSchedule };
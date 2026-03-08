const pool = require('../db');
const { notify } = require('./notifier');

// Call this to apply penalties on all overdue loans
const applyPenalties = async () => {
  try {
    const today = new Date();

    // Get all approved loans that are overdue and not yet penalized today
    const overdueLoans = await pool.query(
      `SELECT loans.*, users.id as uid
       FROM loans
       JOIN users ON loans.user_id = users.id
       WHERE loans.status = 'approved'
       AND loans.due_date < $1
       AND (loans.last_penalty_applied IS NULL
            OR loans.last_penalty_applied < NOW() - INTERVAL '30 days')`,
      [today]
    );

    for (const loan of overdueLoans.rows) {
      // 5% penalty on remaining balance
      const remaining = parseFloat(loan.amount) + parseFloat(loan.interest_amount || 0) - parseFloat(loan.amount_paid);
      const penalty = parseFloat((remaining * 0.05).toFixed(2));

      // Add penalty and update last_penalty_applied
      await pool.query(
        `UPDATE loans
         SET penalty_amount = penalty_amount + $1,
             last_penalty_applied = NOW()
         WHERE loan_id = $2`,
        [penalty, loan.loan_id]
      );

      // Notify the member
      await notify(
        loan.user_id,
        'Loan Penalty Applied',
        `Your loan is overdue. A penalty of ${penalty} RWF has been added to your loan balance.`,
        'loan'
      );

      console.log(`Penalty of ${penalty} applied to loan ${loan.loan_id}`);
    }

    console.log(`Penalty check done. ${overdueLoans.rows.length} loans penalized.`);
  } catch (error) {
    console.error('Penalty checker error:', error);
  }
};

module.exports = { applyPenalties };
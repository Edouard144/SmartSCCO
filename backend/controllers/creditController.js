const { calculateCreditScore } = require('../utils/creditScorer');
const pool = require('../db');

// GET MY CREDIT SCORE — member
const getMyCreditScore = async (req, res) => {
  try {
    // Always recalculate fresh score
    const { score, reasons } = await calculateCreditScore(req.user.id);

    // Give a rating label based on score
    let rating;
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Fair';
    else rating = 'Poor';

    res.json({
      credit_score: score,
      rating,
      breakdown: reasons,
      max_score: 100
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET CREDIT SCORE FOR ANY USER — admin only
const getUserCreditScore = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { score, reasons } = await calculateCreditScore(user_id);

    let rating;
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Fair';
    else rating = 'Poor';

    // Get user info
    const user = await pool.query(
      `SELECT full_name, email FROM users WHERE id = $1`,
      [user_id]
    );

    res.json({
      user: user.rows[0],
      credit_score: score,
      rating,
      breakdown: reasons,
      max_score: 100
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET ALL MEMBERS CREDIT SCORES — admin only
const getAllCreditScores = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, full_name, email, credit_score, credit_score_updated_at
       FROM users
       WHERE role = 'member'
       ORDER BY credit_score DESC`
    );
    res.json({ members: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyCreditScore, getUserCreditScore, getAllCreditScores };
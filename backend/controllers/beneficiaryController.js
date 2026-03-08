const { addBeneficiary, getBeneficiaries, removeBeneficiary } = require('../models/beneficiaryModel');
const pool = require('../db');

// ADD BENEFICIARY — save a frequent recipient
const add = async (req, res) => {
  try {
    const { beneficiary_user_id, nickname } = req.body;

    if (!beneficiary_user_id) {
      return res.status(400).json({ error: 'Beneficiary user ID required' });
    }

    // Cannot add yourself
    if (parseInt(beneficiary_user_id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot add yourself as beneficiary' });
    }

    // Check if beneficiary user exists
    const user = await pool.query(
      `SELECT id, full_name, phone FROM users WHERE id = $1`,
      [beneficiary_user_id]
    );
    if (!user.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already saved
    const existing = await pool.query(
      `SELECT * FROM beneficiaries WHERE user_id = $1 AND beneficiary_user_id = $2`,
      [req.user.id, beneficiary_user_id]
    );
    if (existing.rows[0]) {
      return res.status(400).json({ error: 'Beneficiary already saved' });
    }

    const beneficiary = await addBeneficiary(
      req.user.id,
      beneficiary_user_id,
      nickname || user.rows[0].full_name // Use full name if no nickname
    );

    res.status(201).json({ message: 'Beneficiary added', beneficiary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET BENEFICIARIES — list all saved recipients
const getAll = async (req, res) => {
  try {
    const beneficiaries = await getBeneficiaries(req.user.id);
    res.json({ beneficiaries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// REMOVE BENEFICIARY — delete a saved recipient
const remove = async (req, res) => {
  try {
    const { beneficiary_id } = req.params;
    const deleted = await removeBeneficiary(beneficiary_id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    res.json({ message: 'Beneficiary removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { add, getAll, remove };
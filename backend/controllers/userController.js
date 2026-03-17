const { getUserById } = require('../models/userModel');
const pool = require('../db');

// GET PROFILE — member sees their own profile
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE PROFILE — member updates phone or email
const updateProfile = async (req, res) => {
  try {
    const { phone, email } = req.body;

    const result = await pool.query(
      `UPDATE users SET phone = COALESCE($1, phone), email = COALESCE($2, email)
       WHERE id = $3 RETURNING id, full_name, phone, email, role`,
      [phone, email, req.user.id]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const submitKyc = async (req, res) => {
  try {
    // In a real app, we'd handle file uploads here (e.g. using multer)
    // For now, we update kyc_status to 'pending' to simulate submission
    const result = await pool.query(
      `UPDATE users SET kyc_status = 'pending' WHERE id = $1 RETURNING id, kyc_status`,
      [req.user.id]
    );

    res.json({ message: 'KYC documents submitted for review', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, submitKyc };
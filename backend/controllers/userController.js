const { getUserById, getUserByEmail } = require('../models/userModel');
const pool = require('../db');

// GET PROFILE — member sees their own profile
const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Return limited fields (exclude password_hash, etc.)
    const { password_hash, refresh_token, pin_hash, ...safeUser } = user;
    res.json({ user: safeUser });
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

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user's current password hash
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compare(current_password, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash and update
    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [newHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// SEARCH USERS — find beneficiaries by email, phone, name, or ID
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, phone
       FROM users
       WHERE full_name ILIKE $1
         OR email ILIKE $1
         OR phone ILIKE $1
         OR CAST(id AS TEXT) ILIKE $1
       LIMIT 10`,
      [`%${q}%`]
    );

    // Exclude self from results
    const filtered = result.rows.filter(u => u.id !== req.user.id);

    res.json({ users: filtered });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, submitKyc, searchUsers, changePassword };
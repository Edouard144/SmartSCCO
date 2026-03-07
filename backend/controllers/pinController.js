const bcrypt = require('bcrypt');
const { savePin, getUserPin } = require('../models/userModel');
const pool = require('../db');

// SET PIN
const setPin = async (req, res) => {
  try {
    const { pin } = req.body;
    if (!/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be exactly 4 digits' });
    }
    const pin_hash = await bcrypt.hash(pin, 10);
    await savePin(req.user.id, pin_hash);
    res.json({ message: 'PIN set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// VERIFY PIN — with lockout after 3 failed attempts
const verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;

    // Get user pin info including lockout fields
    const result = await pool.query(
      `SELECT pin_hash, pin_attempts, pin_locked_until FROM users WHERE id = $1`,
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user || !user.pin_hash) {
      return res.status(400).json({ error: 'No PIN set. Please set your PIN first.' });
    }

    // Check if account is currently locked
    if (user.pin_locked_until && new Date() < new Date(user.pin_locked_until)) {
      const minutesLeft = Math.ceil(
        (new Date(user.pin_locked_until) - new Date()) / 60000
      );
      return res.status(403).json({
        error: `PIN locked. Try again in ${minutesLeft} minute(s).`
      });
    }

    const match = await bcrypt.compare(pin, user.pin_hash);

    if (!match) {
      const newAttempts = (user.pin_attempts || 0) + 1;

      if (newAttempts >= 3) {
        // Lock account for 30 minutes after 3 failed attempts
        const lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        await pool.query(
          `UPDATE users SET pin_attempts = 0, pin_locked_until = $1 WHERE id = $2`,
          [lockedUntil, req.user.id]
        );

        // Log fraud alert for PIN lockout
        await pool.query(
          `INSERT INTO fraud_alerts (user_id, alert_type, severity)
           VALUES ($1, 'pin_locked', 'high')`,
          [req.user.id]
        );

        return res.status(403).json({
          error: 'Too many failed attempts. PIN locked for 30 minutes.'
        });
      }

      // Increment failed attempts
      await pool.query(
        `UPDATE users SET pin_attempts = $1 WHERE id = $2`,
        [newAttempts, req.user.id]
      );

      return res.status(400).json({
        error: `Incorrect PIN. ${3 - newAttempts} attempt(s) remaining.`
      });
    }

    // PIN correct — reset attempts and lockout
    await pool.query(
      `UPDATE users SET pin_attempts = 0, pin_locked_until = NULL WHERE id = $1`,
      [req.user.id]
    );

    res.json({ message: 'PIN verified', verified: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { setPin, verifyPin };
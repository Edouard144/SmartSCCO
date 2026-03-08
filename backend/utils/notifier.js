const pool = require('../db');

// Call this anywhere to send a notification to a user
const notify = async (user_id, title, message, type = 'general') => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4)`,
      [user_id, title, message, type]
    );
  } catch (error) {
    // Never crash the app because of notification failure
    console.error('Notification error:', error);
  }
};

module.exports = { notify };
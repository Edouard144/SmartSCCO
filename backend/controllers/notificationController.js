const pool = require('../db');

// GET MY NOTIFICATIONS — newest first
const getMyNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json({ notifications: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// MARK ONE AS READ
const markRead = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE notification_id = $1 AND user_id = $2
       RETURNING *`,
      [notification_id, req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Marked as read', notification: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// MARK ALL AS READ
const markAllRead = async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET UNREAD COUNT — for notification badge
const getUnreadCount = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as unread_count FROM notifications
       WHERE user_id = $1 AND is_read = FALSE`,
      [req.user.id]
    );
    res.json({ unread_count: parseInt(result.rows[0].unread_count) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE A NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const result = await pool.query(
      `DELETE FROM notifications
       WHERE notification_id = $1 AND user_id = $2
       RETURNING *`,
      [notification_id, req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyNotifications, markRead, markAllRead, getUnreadCount, deleteNotification };
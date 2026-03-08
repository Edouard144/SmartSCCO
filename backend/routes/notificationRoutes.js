const express = require('express');
const router = express.Router();
const {
  getMyNotifications, markRead,
  markAllRead, getUnreadCount, deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../utils/authMiddleware');

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get my notifications (last 50)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', protect, getMyNotifications);

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count number
 */
router.get('/unread-count', protect, getUnreadCount);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All marked as read
 */
router.put('/mark-all-read', protect, markAllRead);

/**
 * @swagger
 * /api/notifications/{notification_id}/read:
 *   put:
 *     summary: Mark one notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marked as read
 *       404:
 *         description: Not found
 */
router.put('/:notification_id/read', protect, markRead);

/**
 * @swagger
 * /api/notifications/{notification_id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete('/:notification_id', protect, deleteNotification);

module.exports = router;
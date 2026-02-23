const express = require('express');
const router = express.Router();
const { getUserNotifications, updateUserNotifications } = require('../../controllers/NutritentsController/NotificationReminderController');
const { verifyAccessToken } = require('../../middleware/verifyToken'); // middleware to get req.user

// Get current user's notification settings
router.get('/my-nutrition-reminder', verifyAccessToken, getUserNotifications);

// Update current user's notification settings
router.put('/update', verifyAccessToken, updateUserNotifications);

module.exports = router;
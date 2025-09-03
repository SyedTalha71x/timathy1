// routes/notificationRoutes.js
const express = require('express');
const { getUserNotifications, readNotification, readAllNotifications } = require('../controllers/NotificationController');
const { verifyAccessToken } = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyAccessToken, getUserNotifications);
router.put('/:id/read', verifyAccessToken, readNotification);
router.put('/:id/read-all', verifyAccessToken, readAllNotifications);

module.exports = router;

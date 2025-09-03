const NotificationModel = require('../models/NotificationModel');

// Get all notifications of logged-in user
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id; // comes from auth middleware
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ status: true, notifications });
  } catch (error) {
    next(error);
  }
};

// Mark one notification as read
const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params; // notificationId
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ status: true, notification });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
const readAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    await NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ status: true, message: "All marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserNotifications, readNotification, readAllNotifications };

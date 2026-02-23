const UserNotificationModel = require('../../models/nutritionModels/UserNotification');

// Get current user's notifications
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await UserNotificationModel.findOne({ user: req.user._id });

        if (!notifications) {
            // Create default if not found
            const defaultNotifications = await UserNotificationModel.create({ user: req.user._id });
            return res.status(200).json(defaultNotifications);
        }

        res.status(200).json({ success: true, notification: notifications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update current user's notifications
const updateUserNotifications = async (req, res) => {
    try {
        const updates = req.body;

        // Fix typo if needed (genral -> general)
        if (updates.genral !== undefined) {
            updates.general = updates.genral;
            delete updates.genral;
        }

        const updatedNotifications = await UserNotificationModel.findOneAndUpdate(
            { user: req.user._id },
            { $set: updates },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, notification: updatedNotifications });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUserNotifications, updateUserNotifications };
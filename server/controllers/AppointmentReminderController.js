const AppointmentReminder = require("../models/AppointmentReminderModel");

// Get all reminders for a member
const getMemberReminders = async (req, res) => {
    const userId = req.user?._id;
    try {
        let reminders = await AppointmentReminder.findOne({ user: userId }).populate("reminders.appointmentId");
        if (!reminders) {
            // Create a reminder doc if it doesn't exist
            reminders = await AppointmentReminder.create({ user: userId, reminders: [] });
        }
        res.json({ success: true, reminder: reminders });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch reminders" });
    }
};

// Update reminder for a specific appointment
const updateMemberReminder = async (req, res) => {
    const userId = req.user?._id
    const { appointmentId } = req.params;
    const updateData = req.body; // { emailReminder, pushReminder, smsReminder }

    try {
        let reminderDoc = await AppointmentReminder.findOne({ user: userId });

        if (!reminderDoc) {
            reminderDoc = await AppointmentReminder.create({ user: userId, reminders: [] });
        }

        const existingIndex = reminderDoc.reminders.findIndex(
            (r) => r.appointmentId.toString() === appointmentId
        );

        if (existingIndex >= 0) {
            // Update existing reminder
            reminderDoc.reminders[existingIndex] = { ...reminderDoc.reminders[existingIndex].toObject(), ...updateData };
        } else {
            // Add new reminder
            reminderDoc.reminders.push({ appointmentId, ...updateData });
        }

        await reminderDoc.save();
        res.json({ success: true, reminder: reminderDoc, message: "Reminder updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update reminder" });
    }
};

module.exports = {
    updateMemberReminder,
    getMemberReminders
}
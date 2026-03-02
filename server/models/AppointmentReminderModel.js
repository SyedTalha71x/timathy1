const mongoose = require("mongoose");

const appointmentReminderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "member",
            required: true,
        },
        reminders: [
            {
                appointmentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Appointment",
                    required: true,
                },
                emailReminder: {
                    enabled: { type: Boolean, default: true },
                    timeBeforeHours: { type: Number, default: 24 },
                },
                pushReminder: {
                    enabled: { type: Boolean, default: true },
                    timeBeforeMinutes: { type: Number, default: 30 },
                },
                smsReminder: {
                    enabled: { type: Boolean, default: false },
                    timeBeforeHours: { type: Number, default: 2 },
                },
            },
        ],
    },
    { timestamps: true }
);

const AppointmentRemider = mongoose.model("AppointmentReminder", appointmentReminderSchema);
module.exports = AppointmentRemider
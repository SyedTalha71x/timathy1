const mongoose = require('mongoose')
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: [
            'info',
            "success",
            "warning",
            "error",
            "today-appointment",
            'contract-expiration',
            'appointment-request',
            'contract-paused',
            'memberData-changed',
            'bankData-changed',
            'email-error',
            'vacation-request',
            'studio-chat',
            'member-chat',
            "Birthday",
            'appointment-booked',
            'appointment-canceled',
            'bookingTrail',
            'classCancellation',
            'enrolled_in_class',
            'removed_from_class'
        ],
        default: 'info'
    },
    read: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


const NotificationModel = mongoose.model('Notification', notificationSchema)
module.exports = NotificationModel
const mongoose = require('mongoose')

const userNotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    breakfast: { type: Boolean, default: true },
    lunch: { type: Boolean, default: true },
    dinner: { type: Boolean, default: true },
    // snacks: { type: Boolean, default: true },
    water: { type: Boolean, default: false },
    genral: { type: Boolean, default: false },
}, { timestamps: true })


const UserNotificationModel = mongoose.model('UserNutrientNotification', userNotificationSchema)

module.exports = UserNotificationModel
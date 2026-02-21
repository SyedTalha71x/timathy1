const mongoose = require('mongoose')

const userGoalSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true,
        unique: true
    },
    calories: {
        type: Number,
        required: true,
        default: 2000,
    },
    protein: {
        type: Number,
        required: true,
        default: 150
    },
    carbs: {
        type: Number,
        required: true,
        default: 250
    },
    fats: {
        type: Number,
        required: true,
        default: 70
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const UserGoals = mongoose.model("UserGoals", userGoalSchema)

module.exports = UserGoals
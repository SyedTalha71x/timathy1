const mongoose = require('mongoose')

const userGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

const UserGoals = mongoose.model("USerGoals", userGoalSchema)

module.exports = UserGoals
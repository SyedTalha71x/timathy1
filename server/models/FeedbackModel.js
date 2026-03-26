const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        trim: true,
        required: true
    },
    message: {
        type: String,
        maxlength: 500,
        trim: true,
        required: true
    },
    rating: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


feedbackSchema.index({ type: 1, subject: 1, user: 1 })


const FeedbackModel = mongoose.model('feedback', feedbackSchema)

module.exports = FeedbackModel
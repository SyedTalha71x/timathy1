const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    error: {
        type: String
    }
}, { timestamps: true });

const EmailModel = mongoose.model("email", emailSchema);
module.exports = EmailModel;
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
    star: {
        type: Number,
    }
})
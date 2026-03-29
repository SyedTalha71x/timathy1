const mongoose = require('mongoose');


const classSchema = new mongoose.Schema({
    classType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classType',
        required: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    bookingType: {
        type: String,
        enum: ['single', 'recurring'],
        default: 'single'
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }

}, { timestamps: true })    
const mongoose = require('mongoose')

const shiftSchema = new mongoose.Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date
    },
    type: {
        type: String,
        enum: ['shift', 'absence']
    },
    status: {
        type: String,
        enum: ['completed', 'scheduled'],
        default: 'scheduled'
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Studio"
    }
}, { timestamps: true })

shiftSchema.index({ startDate: 1, endDate: 1, type: 1 })


const shiftModel = mongoose.model('shift', shiftSchema)
module.exports = shiftModel
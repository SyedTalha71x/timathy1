const mongoose = require('mongoose')



const vacationSchema = new mongoose.Schema({
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Studio"
    },
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
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

}, { timestamps: true })


vacationSchema.index({ staff: 1, reason: 1, startDate: 1 })



const VacationModel = mongoose.model('vacation', vacationSchema)

module.exports = VacationModel
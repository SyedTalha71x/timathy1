const mongoose = require('mongoose');


const classSchema = new mongoose.Schema({
    classType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classType',
        required: true,
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    bookingType: {
        type: String,
        enum: ['single', 'recurring'],
        default: 'single'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
    },
    occurrence: {
        type: Number,
        default: 1
    },
    dayOfWeek: {
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true
    },
    classCreatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'canceled', 'confirmed'],
        default: 'pending'
    },
    classStatus: {
        type: String,
        enum: ['upcoming', 'completed', 'canceled', 'past'],
        default: 'upcoming'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    }],
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    seriesId: {
        type: String,
        required: false // only needed for recurring classes
    },
    cancelType: {
        type: String,
        enum: ['single', 'series']
    }

}, { timestamps: true })

classSchema.index({ date: 1, time: 1, room: 1 }, { unique: true })

const ClassModel = mongoose.model('classes', classSchema);

module.exports = ClassModel;
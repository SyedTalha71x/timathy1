const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true,

    },
    timeSlot: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'pending', 'completed', 'canceled', 'confirmed'],
        default: 'scheduled'
    },
    view: {
        type: String,
        enum: ['upcoming', 'pending', 'past'],
        default: 'upcoming'
    },
    isTrial: {
        type: Boolean,
        default: false
    },
    contingentUsed: {
        type: Number,
        default: 5
    },
    bookingType: {
        type: String,
        enum: ['single', 'recurring'],
        default: 'single'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
    },
    occurrences: {
        type: Number,
        default: 1
    },
}, { timestamps: true });

AppointmentSchema.index(
    { serviceId: 1, date: 1, "timeSlot.start": 1, member: 1 }
);


const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);

module.exports = AppointmentModel;
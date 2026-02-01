const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    service: {
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
    contingentUsed: {
        type: Number,
        default: 1
    },

}, { timestamps: true });

AppointmentSchema.index(
    { serviceId: 1, date: 1, "timeSlot.start": 1, member: 1 }
);


const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);

module.exports = AppointmentModel;
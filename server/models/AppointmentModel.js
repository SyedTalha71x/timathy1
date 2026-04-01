const mongoose = require('mongoose')


const appointmentCategoriesSchema = new mongoose.Schema({
    categoryName: {
        type: String
    },
    description: {
        type: String
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }
}, { timestamps: true })

const AppointmentCategoryModel = mongoose.model('appointmentCategory', appointmentCategoriesSchema)

const appointmentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        // required: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lead',
        // required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        // required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        // required: true
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
        },
    },
    note: {
        type: String
    },
    status: {
        type: String,
        enum: ['scheduled', 'pending', 'completed', 'canceled', 'confirmed', 'blocked'],
        default: 'scheduled'
    },
    view: {
        type: String,
        enum: ['upcoming', 'canceled', 'past', 'blocked'],
        default: 'upcoming'
    },
    isTrial: {
        type: Boolean,
        default: false
    },
    isCheckedIn: {
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
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

appointmentSchema.index(
    { serviceId: 1, date: 1, "timeSlot.start": 1, member: 1 }
);

appointmentSchema.methods.isPast = function () {
    const now = new Date();
    const appointmentDate = new Date(this.date);
    const [hours, minutes] = this.timeSlot.start.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Add duration to get end time
    const duration = this.timeSlot.duration || 60;
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    return endTime < now;
};

// Static method to update all past appointments
appointmentSchema.statics.updatePastAppointments = async function () {
    const now = new Date();

    // Find all confirmed upcoming appointments
    const appointments = await this.find({
        status: 'confirmed',
        view: 'upcoming'
    });

    const bulkOps = [];

    for (const appointment of appointments) {
        if (appointment.isPast()) {
            bulkOps.push({
                updateOne: {
                    filter: { _id: appointment._id },
                    update: {
                        $set: {
                            status: 'completed',
                            view: 'past'
                        }
                    }
                }
            });
        }
    }

    if (bulkOps.length > 0) {
        const result = await this.bulkWrite(bulkOps);
        console.log(`Updated ${result.modifiedCount} appointments`);
        return result.modifiedCount;
    }

    return 0;
};

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = { AppointmentModel, AppointmentCategoryModel };
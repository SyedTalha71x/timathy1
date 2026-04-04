const mongoose = require('mongoose')

// ========================
// APPOINTMENT CATEGORIES (Simplified)
// ========================
const appointmentCategoriesSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true,
        index: true
    },
    // Removed color field - not needed
    sortOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

// Add index for better performance and prevent duplicate categories per studio
appointmentCategoriesSchema.index({ studio: 1, categoryName: 1 }, { unique: true });

const AppointmentCategoryModel = mongoose.model('appointmentCategory', appointmentCategoriesSchema)

// ========================
// APPOINTMENT TYPES
// ========================
const appointmentTypeSchema = new mongoose.Schema({
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Studio",
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appointmentCategory',
        required: true
    },
    image: {
        url: String,
        public_id: String
    },
    contingentUsage: {
        type: Number,
        default: 1,
        min: 0,
        max: 100
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    duration: {
        type: Number,
        required: true,
        min: 5,
        default: 30
    },
    interval: {
        type: Number,
        required: true,
        min: 5,
        default: 30
    },
    slot: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    maxParallel: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    calenderColor: {
        type: String,
        default: '#FF843E',
        match: /^#[0-9A-Fa-f]{6}$/
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0,
        comment: 'For custom ordering in UI'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

// Add indexes
appointmentTypeSchema.index({ studioId: 1, name: 1 }, { unique: true });
appointmentTypeSchema.index({ studioId: 1, category: 1 });
appointmentTypeSchema.index({ studioId: 1, isActive: 1 });
appointmentTypeSchema.index({ sortOrder: 1 });

// Pre-save middleware for sortOrder
appointmentTypeSchema.pre('save', async function(next) {
    if (this.isNew && !this.sortOrder) {
        const lastType = await this.constructor.findOne({ studioId: this.studioId })
            .sort({ sortOrder: -1 });
        this.sortOrder = (lastType?.sortOrder || 0) + 1;
    }
    next();
});

// Virtual for type (to match frontend expectations)
appointmentTypeSchema.virtual('type').get(function() {
    return 'service';
});

// Virtual for formatted price
appointmentTypeSchema.virtual('formattedPrice').get(function() {
    return `${this.price.toFixed(2)} €`;
});

const AppointmentTypeModel = mongoose.model('AppointmentTypes', appointmentTypeSchema)

// ========================
// APPOINTMENTS
// ========================
const appointmentSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        index: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lead',
        index: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true,
        index: true
    },
    appointmentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AppointmentTypes',
        required: true
    },
    date: {
        type: Date,
        required: true,
        index: true
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
        duration: {
            type: Number,
            default: 60
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
    },
    note: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'pending', 'completed', 'canceled', 'confirmed', 'blocked', 'rejected'],
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
        default: 1,
        min: 0
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
        default: 1,
        min: 1
    },
    recurringGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        comment: 'Group ID for recurring appointments'
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    }
}, { timestamps: true });

// Compound indexes for better query performance
appointmentSchema.index({ appointmentType: 1, date: 1, "timeSlot.start": 1 });
appointmentSchema.index({ studio: 1, status: 1, view: 1 });
appointmentSchema.index({ member: 1, date: -1 });
appointmentSchema.index({ lead: 1, date: -1 });
appointmentSchema.index({ recurringGroupId: 1 });

// Method to check if appointment is past
appointmentSchema.methods.isPast = function () {
    const now = new Date();
    const appointmentDate = new Date(this.date);
    const [hours, minutes] = this.timeSlot.start.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const duration = this.timeSlot.duration || 60;
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    return endTime < now;
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canCancel = function () {
    if (this.status === 'canceled' || this.status === 'completed') {
        return false;
    }
    
    // Check if appointment is more than 24 hours away
    const now = new Date();
    const appointmentDate = new Date(this.date);
    const [hours, minutes] = this.timeSlot.start.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);
    return hoursDiff > 24;
};

// Static method to update all past appointments
appointmentSchema.statics.updatePastAppointments = async function () {
    const now = new Date();

    const appointments = await this.find({
        status: { $in: ['confirmed', 'scheduled'] },
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

// Static method to get appointments by member
appointmentSchema.statics.getByMember = function(memberId, options = {}) {
    const query = this.find({ member: memberId })
        .populate('appointmentType', 'name duration calenderColor price')
        .populate('studio', 'studioName')
        .sort({ date: options.sortOrder || -1 });
    
    if (options.status) query.where('status', options.status);
    if (options.upcoming) query.where('date').gte(new Date());
    
    return query;
};

// Static method to get appointments by studio
appointmentSchema.statics.getByStudio = function(studioId, options = {}) {
    const query = this.find({ studio: studioId })
        .populate('member', 'firstName lastName email')
        .populate('lead', 'firstName lastName email')
        .populate('appointmentType', 'name duration calenderColor')
        .sort({ date: options.sortOrder || -1 });
    
    if (options.status) query.where('status', options.status);
    if (options.dateFrom) query.where('date').gte(options.dateFrom);
    if (options.dateTo) query.where('date').lte(options.dateTo);
    
    return query;
};

const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = { 
    AppointmentModel, 
    AppointmentCategoryModel, 
    AppointmentTypeModel 
};
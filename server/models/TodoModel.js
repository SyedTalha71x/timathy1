const mongoose = require('mongoose')


const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task title required'],
        trim: true,
        max: [500, "Task title cannot exceed 500"],
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'canceled'],
        default: 'ongoing',
        index: true,
    },
    dueDate: {
        type: Date,
        default: Date.now(),
        index: true
    },
    dueTime: {
        type: String,
        index: true,
        validate: {
            validator: function (v) {
                return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Invalid time format. Use HH:MM'
        }
    },
    // Reminder settings
    reminder: {
        type: String,
        enum: ['None', 'At time of event', '5 minutes before', '10 minutes before',
            '15 minutes before', '30 minutes before', '1 hour before',
            '2 hours before', '1 day before', '2 days before', 'Custom'],
        default: 'None'
    },
    customReminder: {
        value: Number,
        unit: {
            type: String,
            enum: ['Minutes', 'Hours', 'Days']
        }
    },
    reminderSent: {
        type: Boolean,
        default: false
    },

    // Repeat settings
    repeat: {
        type: String,
        enum: ['None', 'Daily', 'Weekdays', 'Weekly', 'Biweekly', 'Monthly', 'Yearly', 'Custom'],
        default: 'None'
    },
    repeatSettings: {
        frequency: String,
        interval: Number,
        daysOfWeek: [Number], // 0-6 for Sunday-Saturday
        dayOfMonth: Number,
        monthOfYear: Number,
        endDate: Date,
        occurrences: Number
    },
    // Pinned status (for sorting)
    isPinned: {
        type: Boolean,
        default: false,
        index: true
    },
    // Assignees (staff members)
    assignees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        index: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    canceledAt: Date,
    canceledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    isCanceled: { type: Boolean, default: false },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true,
        index: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }]

}, { timestamps: true })

// Indexes for common queries
todoSchema.index({ studioId: 1, status: 1, dueDate: 1 });
todoSchema.index({ studioId: 1, assignees: 1, status: 1 });
todoSchema.index({ studioId: 1, tags: 1 });
todoSchema.index({ studioId: 1, isPinned: 1 });


// Virtual for checking if task is overdue
todoSchema.virtual('isOverdue').get(function () {
    if (!this.dueDate || this.status !== 'ongoing') return false;
    return new Date() > this.dueDate;
});

// Pre-save middleware to update timestamps
todoSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});


const TodoModel = mongoose.model('Todo', todoSchema)

module.exports = TodoModel
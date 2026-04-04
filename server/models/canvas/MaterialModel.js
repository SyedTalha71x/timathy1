const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: "Page 1"
    },
    content: {
        type: String,
        default: ""
    }
});

const materialSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        // required: true,
        trim: true,
        default: "Untitled Material"
    },
    pages: [pageSchema],
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
});

// Middleware to update the updatedAt timestamp
materialSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for efficient queries
materialSchema.index({ studio: 1, createdAt: -1 });
materialSchema.index({ studio: 1, isActive: 1, order: 1 });

const materialModel = mongoose.model('IntroductoryMaterial', materialSchema);
module.exports = materialModel
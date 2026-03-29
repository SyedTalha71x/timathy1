// models/DocumentModel.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    // File information
    url: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
    },
    size: {
        type: Number,
    },

    // Document categorization
    section: {
        type: String,
        enum: ['general', 'contracts', 'payments', 'other','medicalHistory'],
        default: 'general'
    },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],

    // Optional reference to related data
    relatedTo: {
        model: {
            type: String,
            enum: ['Contract', 'MedicalHistoryForm', 'SepaMandate', null]
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'relatedTo.model'
        }
    },

    uploadDate: {
        type: Date,
        default: Date.now
    },

    uploadedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: String
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for formatted size
documentSchema.virtual('formattedSize').get(function () {
    if (!this.size) return '0 B';
    const bytes = this.size;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
});

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = DocumentModel;
const mongoose = require('mongoose')

const contractFormSchema = new mongoose.Schema({
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true,
        index: true
    },

    // Basic Info
    name: {
        type: String,
        required: true,
        default: 'Untitled Contract'
    },

    // Pages - Main content (what the builder saves)
    pages: [{
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            default: 'Contract Page'
        },
        // Canvas elements - saved as Mixed because builder controls the structure
        elements: {
            type: mongoose.Schema.Types.Mixed,
            default: []
        },
        backgroundImage: {
            type: String,  // base64 or URL
            default: null
        },
        locked: {
            type: Boolean,
            default: false  // For PDF imported pages
        },
        isPdfPage: {
            type: Boolean,
            default: false
        }
    }],

    // Folders for organizing elements (reusable components)
    folders: [{
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: '#3b82f6'
        },
        expanded: {
            type: Boolean,
            default: true
        },
        elements: {
            type: mongoose.Schema.Types.Mixed,  // Saved elements in folder
            default: []
        }
    }],

    // Global Header Configuration
    globalHeader: {
        enabled: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        fontSize: {
            type: Number,
            default: 12
        },
        alignment: {
            type: String,
            enum: ['left', 'center', 'right'],
            default: 'center'
        },
        verticalAlignment: {
            type: String,
            enum: ['top', 'center', 'bottom'],
            default: 'center'
        },
        bold: {
            type: Boolean,
            default: false
        },
        italic: {
            type: Boolean,
            default: false
        },
        showOnPages: {
            type: String,
            enum: ['all', 'first', 'last', 'exceptFirst'],
            default: 'all'
        }
    },

    // Global Footer Configuration
    globalFooter: {
        enabled: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        fontSize: {
            type: Number,
            default: 12
        },
        alignment: {
            type: String,
            enum: ['left', 'center', 'right'],
            default: 'center'
        },
        verticalAlignment: {
            type: String,
            enum: ['top', 'center', 'bottom'],
            default: 'center'
        },
        bold: {
            type: Boolean,
            default: false
        },
        italic: {
            type: Boolean,
            default: false
        },
        showOnPages: {
            type: String,
            enum: ['all', 'first', 'last', 'exceptFirst'],
            default: 'all'
        }
    },

    // Version tracking
    version: {
        type: Number,
        default: 1
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

// Indexes for faster queries
contractFormSchema.index({ studioId: 1, isActive: 1 });
contractFormSchema.index({ studioId: 1, createdAt: -1 });

const contractFormModel = mongoose.model('ContractForm', contractFormSchema);
module.exports = contractFormModel
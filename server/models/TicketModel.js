const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'support'],
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    uploadedImages: {
        url: String,
        public_id: String
    }
});

const ticketSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    additionalDescription: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'awaiting', 'resolved', 'close'],
        default: 'open'
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    closedAt: Date,
    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Conversation messages array
    messages: [messageSchema],
    
    // Legacy fields for backward compatibility
    replyText: String,
    repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadedImages: {
        url: String,
        public_id: String
    },
    uploadedImagesBySupport: {
        url: String,
        public_id: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
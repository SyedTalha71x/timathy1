const mongoose = require('mongoose')

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    attachment: {
        url: String,
        public_id: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff'
    }],
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }
}, { timestamps: true })


notesSchema.index({ title: 1, tags: 1 })

const NotesModel = mongoose.model('notes', notesSchema)

module.exports = NotesModel
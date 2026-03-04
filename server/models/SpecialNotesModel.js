const mongoose = require('mongoose');

const specialNotesSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['contract_attempt', 'callback-request', 'interest', 'objection', 'personal_info', 'health', 'follow-up', 'general'],
        default: 'general'
    },
    note: {
        type: String,
        required: true
    },
    isImportant: {
        type: Boolean,
        default: false
    },
    valid: {
        from: {
            type: Date
        },
        until: {
            type: Date
        }
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lead'
    }
}, { timestamps: true })


const specialNotesModel = mongoose.model('specialNotes', specialNotesSchema)

module.exports = specialNotesModel
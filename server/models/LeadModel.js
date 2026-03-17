const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true

    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String
    },
    phone: {
        type: String,
    },
    telephone: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: 'male',
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    zipCode: {
        type: Number,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
    },
    source: {
        type: String
    },
    column: {
        type: String
    },
    trainingGoal: {
        type: String
    },
    about: {
        type: String
    },
    relations: [{
        entryType: {
            type: String,
            enum: ['manual', 'member', 'lead'],
            default: 'manual'
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'lead'
        },
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'member'
        },
        category: {
            type: String,
            enum: ['family', 'relationship', 'friendship', 'work', 'other'],
            default: 'family'
        },
        relationType: {
            type: String,
        },
        customRelation: {
            type: String,
        }
    }],
    specialsNotes: [{
        status: {
            type: String,
            enum: ['contract_attempt', 'callback_requested', 'interest', 'objection', 'personal_info', 'health', 'follow_up', 'general'],
            default: 'general'
        },
        note: {
            type: String,
            // required: true
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
    }],
    isConverted: {
        type: Boolean,
        default: false
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    img: {
        url: String,
        public_id: String
    },
    leadNo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    appointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }]

})


const LeadModel = mongoose.model('lead', leadSchema)

module.exports = LeadModel
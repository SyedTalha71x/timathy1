const mongoose = require('mongoose')

const relationSchema = new mongoose.Schema({
    entryType: {
        type: String,
        enum: ['manual', 'existing_member', 'existing_lead'],
        default: 'manual'
    },
    name: {
        type: String,
        required: true
    },
    ownerMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lead'
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
})


const RelationModel = mongoose.model('relations', relationSchema)

module.exports = RelationModel
const mongoose = require('mongoose')

const relationSchema = new mongoose.Schema({
    entryType: {
        type: String,
        enum: ['manual_entry', 'existing_member', 'existing_lead'],
        default: 'manual_entry'
    },
    name: {
        type: String,
        required: true
    },
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    category: {
        type: String,
        enum: ['family,relationship', 'friendship', 'work', 'other'],
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
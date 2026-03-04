const mongoose = require('mongoose')

const leadSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phone: {
        type: Number
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
    },
    street: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true,
    },
    source: {
        type: String
    },
    status: {
        type: String
    },
    trainingGoal: {
        type: String
    },
    about: {
        type: String
    },
    relations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'relations'
    }],
    specialsNotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'specialNotes'
    }],
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
    }


})


const LeadModel = mongoose.model('lead', leadSchema)

module.exports = LeadModel
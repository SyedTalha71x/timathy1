const mongoose = require('mongoose')


const pauseReasonSchema = new mongoose.Schema({
    reasonName: {
        type: String,
        trim: true,
        required: true
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    maxDuration: {
        type: Number,
        default: 30
    }
}, { timestamps: true })



const changeReasonSchema = new mongoose.Schema({
    reasonName: {
        type: String,
        trim: true,
        required: true
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
}, { timestamps: true })


const renewReasonSchema = new mongoose.Schema({
    reasonName: {
        type: String,
        trim: true,
        required: true
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
}, { timestamps: true })


const bonusReasonSchema = new mongoose.Schema({
    reasonName: {
        type: String,
        trim: true,
        required: true
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
}, { timestamps: true })


const pauseReasonModel = mongoose.model('pauseReason', pauseReasonSchema)
const changeReasonModel = mongoose.model('changeReason', changeReasonSchema)
const renewReasonModel = mongoose.model('renewReason', renewReasonSchema)
const bonusReasonModel = mongoose.model('bonusReason', bonusReasonSchema)

module.exports = {
    pauseReasonModel,
    changeReasonModel,
    renewReasonModel,
    bonusReasonModel
}
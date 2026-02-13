const mongoose = require('mongoose')

const trainingPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        min: 2,
        max: 20
    },
    description: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    duration: {
        type: String,
    },
    workOut: {
        types: String
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'advance', 'intermediate'],
        default: 'beginner'
    },
    category: {
        type: String,
        enum: ['full_body', 'upper_body', 'lower_body', 'cardio', 'strength', 'flexibility'],
        default: 'full_body'
    },
    exercise: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'video'
    }]
})


const TrainingModel = mongoose.model('training_plan', trainingPlanSchema)

module.exports = TrainingModel
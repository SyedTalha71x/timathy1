const mongoose = require("mongoose")

const userMicroNutrientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    microNutrient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MicroNutrients"
    },
    current: {
        type: Number,
        required: true
    },
    targetMin: {
        type: Number,
    },
    targetMax: {
        type: Number,
    },
    critical: {
        type: Boolean,
        default: false
    },
    dateMeasured: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

userMicroNutrientSchema.index({ user: 1, microNutrient: 1 }, { unique: true })


const UserMicroNutrientsModel = mongoose.model("UserMicroNutrients",userMicroNutrientSchema)

module.exports = UserMicroNutrientsModel
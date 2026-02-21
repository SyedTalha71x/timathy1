const mongoose = require('mongoose')

const mealItemSchema = new mongoose.Schema({
    // food: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Food",
    //     required:true
    // },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number, //e.g 2 bowls
        default: 1
    },
    unit: {
        type: String,  //e.g "bowl","slice"
        default: ""
    },
    notes: {
        type: String,
        default: ""
    }
});


const dailyLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    meals: {
        breakfast: [mealItemSchema],
        lunch: [mealItemSchema],
        dinner: [mealItemSchema],
        snacks: [mealItemSchema],
    }

}, { timestamps: true })


dailyLogSchema.index({ user: 1, date: 1 }, { unique: true })

const dailyLogModel = mongoose.model("DailyLog", dailyLogSchema)

module.exports = dailyLogModel
const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    serving: {
        type: String, // e.g "100g","1 cup"
        required: true,
    },
    servingSize: {
        type: Number,
        default: 100
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fats: {
        type: Number,
        required: true
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });


const foodModel = mongoose.model('Food', foodSchema)

module.exports = foodModel;
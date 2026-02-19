const mongoose = require("mongoose")


const microNutrientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["vitamin", "mineral"],
        required: true
    },
    scientificName: {
        type: String
    },
    unit: {
        type: String,
    },
    decription: {
        type: String,
    },
    icon: {
        url: String,
        public_id: String
    }
}, { timestamps: true })


const microNutrientModel = mongoose.model("MicroNutrients",microNutrientSchema)

module.exports = microNutrientModel
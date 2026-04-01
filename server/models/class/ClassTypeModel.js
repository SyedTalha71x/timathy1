
const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    }
}, { timestamps: true })

const CategoryModel = mongoose.model('category', categorySchema)

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    }
}, { timestamps: true })
const RoomModel = mongoose.model('room', roomSchema)


const classTypeSchema = new mongoose.Schema({
    img: {
        url: String,
        public_id: String,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    description: {
        type: String,
    },
    duration: {
        type: Number,
    },
    maxPeople: {
        type: Number,
    },
    calenderColor: {
        type: String,
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
    },
}, { timestamps: true })


classTypeSchema.index({ name: 1, classType: 1, duration: 1 })



const ClassTypeModel = mongoose.model('classType', classTypeSchema)

module.exports = { ClassTypeModel, CategoryModel, RoomModel }
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    img: {
        url: String,
        public_id: String
    },
    title: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    schedule: {
        type: String,
        enum: ['immediately', 'schedule']
    },
    scheduleDate: {
        type: Date,
    },
    scheduleTime: {
        type: String,
    },
    scheduleEndTime: {
        type: String
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    postType: {
        type: String,
        enum: ['staff', 'member'],
        default: 'staff'
    }
}, { timestamps: true })


postSchema.index({ title: 1, content: 1, status: 1, tags: 1 })


const PostModel = mongoose.model('post', postSchema)

module.exports = PostModel
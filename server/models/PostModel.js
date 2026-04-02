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
        enum: ['immediately', 'scheduled']
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
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'scheduled'],
        default: 'active'
    },

    postType: {
        type: String,
        enum: ['private', 'public'],
        default: 'staff'
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })


postSchema.index({ title: 1, content: 1, status: 1, tags: 1 })


const PostModel = mongoose.model('post', postSchema)

module.exports = PostModel
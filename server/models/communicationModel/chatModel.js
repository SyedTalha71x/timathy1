const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    chatName: {
        type: String
    },

    // For user-to-user OR group chat
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    // For studio chat
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    },

    // Optional (very useful)
    lastMessage: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

chatSchema.index({ member: 1, studio: 1 }, { unique: true })

const chatModel = mongoose.model('chats', chatSchema)
module.exports = chatModel
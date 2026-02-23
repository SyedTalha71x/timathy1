const mongoose = require('mongoose')


const chatSchema = new mongoose.Schema({
    isGroupChat: {
        type: Boolean,
        default: false
    },
    chatName: {
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true })


const chatModel = mongoose.model('chats', chatSchema)
module.exports = chatModel

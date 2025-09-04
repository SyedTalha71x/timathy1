const mongoose = require('mongoose');
const emailSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff',

    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subject: {
        type: String
    },
    body: String,
    date: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true })



const EmailModel = mongoose.model("email", emailSchema);
module.exports = EmailModel
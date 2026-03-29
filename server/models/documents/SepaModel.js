// models/SepaMandateModel.js
const mongoose = require('mongoose');

const sepaMandateSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member',
        required: true
    },
    memberName: String,
    accountHolderFirstName: String,
    accountHolderLastName: String,
    iban: String,
    bic: String,
    bankName: String,
    mandateNumber: String,
    signature: String,
    signedAt: Date,
    status: {
        type: String,
        enum: ['pending', 'signed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const SEPAModel = mongoose.model('SepaMandate', sepaMandateSchema);
module.exports = SEPAModel;
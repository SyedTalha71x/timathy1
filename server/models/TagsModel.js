const mongoose = require('mongoose')

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    color: {
        type: String,
        default: '#f97316',
        validate: {
            validator: function (v) {
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: "Invalid hex color code"
        },
        unique: true
    },
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }
}, { timestamps: true })


tagsSchema.index({ studioId: 1, name: 1 }, { unique: true });



const TagsModel = mongoose.model('Tags', tagsSchema)
module.exports = TagsModel
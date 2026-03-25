// models/LinkModel.js
const mongoose = require('mongoose');

const websiteLinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return validateUrl(v);
            },
            message: 'Please enter a valid URL (e.g., https://example.com)'
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio'
    }

}, {
    timestamps: true
});

// URL Validation Function
const validateUrl = (url) => {
    try {
        // Check if URL exists
        if (!url) return false;

        // Trim whitespace
        url = url.trim();

        // Check if URL has protocol, if not add https://
        if (!url.match(/^[a-zA-Z]+:\/\//)) {
            url = 'https://' + url;
        }

        // Regular expression for comprehensive URL validation
        const urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

        if (!urlPattern.test(url)) {
            return false;
        }

        // Additional check for valid domain
        const urlObj = new URL(url);
        return urlObj.hostname.length > 0;
    } catch (error) {
        return false;
    }
};

// Pre-save middleware to format URL
websiteLinkSchema.pre('save', function (next) {
    // Format URL to ensure it has protocol
    if (this.url && !this.url.match(/^[a-zA-Z]+:\/\//)) {
        this.url = 'https://' + this.url;
    }

    // Update timestamps
    this.updatedAt = Date.now();

    next();
});





// Index for better query performance
websiteLinkSchema.index({ url: 1 }, { unique: true });



const websiteModel = mongoose.model('WebsiteLink', websiteLinkSchema);
module.exports = websiteModel;
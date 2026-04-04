const mongoose = require('mongoose');


const vatRateSchema = new mongoose.Schema({
  rate: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Studio'
  }
}, { timestamps: true })
vatRateSchema.index({ studioId: 1, rate: 1 }, { unique: true });
const vatRateModel = mongoose.model('vatRate', vatRateSchema)

const serviceSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: { url: String, public_id: String },
    vatRate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'vatRate'
    },
    price: {
      type: Number,
      required: true
    },
    contingentCredit: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Please enter a valid URL (e.g., https://example.com)'
      }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model('Service', serviceSchema);
module.exports = { ServiceModel, vatRateModel }

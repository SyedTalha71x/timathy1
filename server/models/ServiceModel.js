const mongoose = require('mongoose');

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
    description: String,
    category: {
      type: String,
      enum: ['Health Check', 'Wellness', 'Personal Training', 'Recovery', 'Mindfulness', 'Group Class'],
      required: true,
    },
    price: {
      type: Number,
      required: true
    },
    duration: { type: Number, required: true }, // in minutes
    interval: { type: Number, required: true }, // in minutes
    contingentUsage: { type: Number, default: 1, max: 8 },
    slot: { type: String },
    maxSimultaneous: { type: Number, default: 1 },
    calenderColor: { type: String }
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model('Service', serviceSchema);
module.exports = ServiceModel

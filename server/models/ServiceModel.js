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
    duration: { type: String, required: true }, // in minutes
    contingentUsage: { type: Number, default: 1, max: 8 },
    maxSimultaneous: { type: Number, default: 1 }, // how many can be booked at same time
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model('Service', serviceSchema);
module.exports = ServiceModel

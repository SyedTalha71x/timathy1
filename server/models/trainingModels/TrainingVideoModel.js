// models/TrainingVideo.js
const mongoose = require("mongoose");

const trainingVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    videoUrl: {
      url: String,
      public_id: String, // Cloudinary video URL
    },

    thumbnail: {
      url: String, // Cloudinary image URL
      public_id: String,
    },

    duration: {
      type: String, // "12:30"
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    category: {
      type: String, // chest, back, legs, etc
      required: true,
    },

    targetMuscles: [
      {
        type: String, // ["Chest", "Triceps"]
      },
    ],

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingVideo", trainingVideoSchema);

// models/subSchemas/ExerciseSchema.js
const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingVideo",
      required: true,
    },

    sets: {
      type: Number,
      default: 3,
    },

    reps: {
      type: String,
      default: "10-12",
    },

    rest: {
      type: String,
      default: "60s",
    },
  },
  { _id: false }
);

module.exports = exerciseSchema;

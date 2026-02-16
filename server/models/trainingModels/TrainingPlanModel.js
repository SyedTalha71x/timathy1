// models/TrainingPlan.js
const mongoose = require("mongoose");
const exerciseSchema = require("./selectedExercise");

const trainingPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration: {
      type: String, // "8 Weeks"
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    category: {
      type: String, // Full Body, Push, Pull, etc
    },

    workoutsPerWeek: {
      type: Number,
    },

    exercises: [exerciseSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true
    },
    isPublic: {
      type: Boolean,
      default: true,
    },

    likes: {
      type: Number,
      default: 0,
    },

    uses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TrainingPlan", trainingPlanSchema);

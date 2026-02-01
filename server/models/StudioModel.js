const mongoose = require("mongoose");

const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    open: {
      type: String, // "08:00"
    },
    close: {
      type: String, // "20:00"
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const studioSchema = new mongoose.Schema(
  {
    studioName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studioOwner: {
      type: String,
      trim: true,
    },

    phone: String,
    email: { type: String, lowercase: true, trim: true },

    street: String,
    zipCode: String,
    city: String,
    country: String,
    website: String,

    // NEW: overall studio capacity
    overallCapacity: {
      type: Number,
      required: true,
    },

    // REPLACED structure (easier booking logic)
    openingHours: [openingHourSchema],

    // FIXED: use Date instead of String
    closingDays: [
      {
        date: {
          type: Date, // YYYY-MM-DD
          required: true,
        },
        reason: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Studio", studioSchema);

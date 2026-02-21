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
    registrationNumber: {
      type: String,
      required: true
    },
    texId: {
      type: String,
      required: true
    },
    password: {
      type: String,
      // required: true,
      minlength: 8,
      select: false,
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@.-_$!%*?&])[A-Za-z\d@$!.-_%*?&]{8,}$/.test(v);
        },
        message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      }
    },
    court:{
      type:String,
      required:true
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
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Studio", studioSchema);

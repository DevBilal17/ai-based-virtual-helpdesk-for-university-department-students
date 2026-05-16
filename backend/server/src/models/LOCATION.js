const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    location_name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
      minlength: [3, "Location name must be at least 3 characters"],
      maxlength: [100, "Location name must not exceed 100 characters"],
      unique: true,
    },

    location_description: {
      type: String,
      required: [true, "Location description is required"],
      trim: true,
      minlength: [5, "Location description must be at least 5 characters"],
      maxlength: [1000, "Location description must not exceed 1000 characters"],
    },

    location_category: {
      type: String,
      lowercase: true,
      required: [true, "Location category is required"],
      enum: [
        "classroom",
        "office",
        "lab",
        "washroom",
        "hall",
        "library",
        "meeting_room",
        "conference_room",
        "faculty_room",
        "other",
      ],
      default: "other",
    },

    location_status: {
      type: String,
      lowercase: true,
      required: [true, "Location status is required"],
      enum: ["active", "inactive"],
      default: "active",
    },

    location_image: {
      type: String,
      required: [true, "Location image is required"],
    },

    cloudinary_public_id: {
      type: String,
      required: [true, "Cloudinary public id is required"],
    },

    location_qr: {
      type: String,
      required: [true, "Location QR code is required"],
    },

    location_qr_public_id: {
      type: String,
      required: [true, "Location QR public id is required"],
    },

    location_views: {
      type: Number,
      default: 0,
      min: [0, "Location views cannot be negative"],
    },

    building: {
      type: String,
      required: [true, "Building name is required"],
      trim: true,
      minlength: [2, "Building name must be at least 2 characters"],
      maxlength: [100, "Building name must not exceed 100 characters"],
    },

    floor: {
      type: String,
      required: [true, "Floor is required"],
      trim: true,
      maxlength: [50, "Floor must not exceed 50 characters"],
    },

    position: {
      x: {
        type: Number,
        required: true,
      },

      y: {
        type: Number,
        required: true,
      },
    },

    route_points: [
      {
        x: {
          type: Number,
          required: true,
        },

        y: {
          type: Number,
          required: true,
        },
      },
    ],

    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },

    creator_name: {
      type: String,
      required: true,
    },

    updater_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },

    updater_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const LOCATION = mongoose.model("LOCATION", locationSchema);

module.exports = LOCATION;

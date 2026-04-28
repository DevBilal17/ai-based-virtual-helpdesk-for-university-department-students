const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    file_name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // duplicate prevention
    },

    file_description: {
      type: String,
      required: true,
      trim: true,
    },

    file_link: {
      type: String,
      required: true,
    },

    cloudinary_public_id: {
      type: String,
      required: true,
    },

    uploaded_by_name: {
      type: String,
      required: true,
    },

    uploaded_by_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
  },
  { timestamps: true },
);

const DATA = mongoose.model("DATA", dataSchema);

module.exports = DATA;

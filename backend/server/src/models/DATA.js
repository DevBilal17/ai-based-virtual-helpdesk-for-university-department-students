const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    file_name: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
      minlength: [4, "File name must be at least 4 characters"],
      maxlength: [100, "File name must not exceed 100 characters"],
      unique: true, // duplicate prevention
    },

    file_description: {
      type: String,
      required: [true, "File description is required"],
      trim: true,
      minlength: [4, "File description must be at least 4 characters"],
      maxlength: [500, "File description must not exceed 500 characters"],
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

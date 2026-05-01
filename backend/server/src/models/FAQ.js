const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      minlength: [4, "Question must be at least 4 characters"],
      maxlength: [200, "Question must not exceed 200 characters"],
      unique: true, // duplicate prevention
    },

    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      minlength: [4, "Answer must be at least 4 characters"],
      maxlength: [2000, "Answer must not exceed 2000 characters"],
    },

    category: {
      type: String,
      lowercase: true,
      required: [true, "Category is required"],
      enum: [
        "general",
        "technical",
        "security",
        "fee",
        "admissions",
        "attendance",
        "result",
        "courses",
        "examination",
        "rules",
        "events",
        "library",
        "scholarship",
      ],
      default: "general",
    },

    status: {
      type: String,
      lowercase: true,
      required: [true, "Status is required"],
      enum: ["active", "inactive"],
      default: "active",
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },

    createdByName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;

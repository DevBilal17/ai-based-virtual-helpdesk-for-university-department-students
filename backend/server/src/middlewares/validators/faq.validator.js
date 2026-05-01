const { body, param, query } = require("express-validator");

const categories = [
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
];
const statuses = ["active", "inactive"];

// ================= ADD FAQ VALIDATOR =================
const addFAQValidator = [
  body("question")
    .isString()
    .trim()
    .isLength({ min: 4, max: 200 })
    .withMessage("Question must be between 4 and 200 characters"),
  body("answer")
    .isString()
    .trim()
    .isLength({ min: 4, max: 2000 })
    .withMessage("Answer must be between 4 and 2000 characters"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(categories)
    .withMessage(`Category must be one of ${categories.join(", ")}`),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(statuses)
    .withMessage(`Status must be one of ${statuses.join(", ")}`),
];

// ================= GET ALL FAQS VALIDATOR =================
const getAllFAQSValidator = [];

// ================= GET FAQ BY ID VALIDATOR =================
const getFAQByIdValidator = [];

// ================= UPDATE FAQ BY ID VALIDATOR =================
const updateFAQByIdValidator = [];

// ================= DELETE FAQ BY ID VALIDATOR =================
const deleteFAQByIdValidator = [];

// ================= CHANGE FAQ STATUS BY ID VALIDATOR =================
const changeFAQStatusByIdValidator = [];

// ================= GET FAQS FOR STUDENTS VALIDATOR =================
const getFAQSValidator = [];

module.exports = {
  addFAQValidator,
  getAllFAQSValidator,
  getFAQByIdValidator,
  updateFAQByIdValidator,
  deleteFAQByIdValidator,
  changeFAQStatusByIdValidator,
  getFAQSValidator,
};

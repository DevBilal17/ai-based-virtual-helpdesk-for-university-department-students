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

// allowed categories for get all faqs (includes 'all' for filtering)
const allowedCategories = [
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
  "all",
];

const statuses = ["active", "inactive"];

// allowed statuses for get all faqs (includes 'all' for filtering)
const allowedStatuses = ["active", "inactive", "all"];

// Allowed update fields (global safeguard)
const allowedFields = ["question", "answer", "category", "status"];

// =======================================================================================

// ================= ADD FAQ VALIDATOR =================
const addFAQValidator = [
  body("question")
    .notEmpty()
    .withMessage("Question is required")
    .isString()
    .trim()
    .isLength({ min: 4, max: 200 })
    .withMessage("Question must be between 4 and 200 characters"),

  body("answer")
    .notEmpty()
    .withMessage("Answer is required")
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
const getAllFAQSValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search").optional().isString().withMessage("Search must be a string"),

  query("category")
    .optional()
    .isIn(allowedCategories)
    .withMessage(`Category must be one of ${allowedCategories.join(", ")}`),

  query("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage(`Status must be one of ${allowedStatuses.join(", ")}`),
];

// ================= GET FAQ BY ID VALIDATOR =================
const getFAQByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("FAQ ID is required")
    .isMongoId()
    .withMessage("Invalid FAQ ID"),
];

// ================= UPDATE FAQ BY ID VALIDATOR =================
const updateFAQByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("FAQ ID is required")
    .isMongoId()
    .withMessage("Invalid FAQ ID"),

  body("question")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 4, max: 200 })
    .withMessage("Question must be between 4 and 200 characters"),

  body("answer")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 4, max: 2000 })
    .withMessage("Answer must be between 4 and 2000 characters"),

  body("category")
    .optional()
    .isIn(categories)
    .withMessage(`Category must be one of ${categories.join(", ")}`),

  body("status")
    .optional()
    .isIn(statuses)
    .withMessage(`Status must be one of ${statuses.join(", ")}`),

  // Ensure at least one field is provided
  body().custom((value) => {
    const hasAtLeastOneField = allowedFields.some((field) => value[field]);

    if (!hasAtLeastOneField) {
      throw new Error("At least one field must be provided for update");
    }

    return true;
  }),

  // Final safeguard: reject unknown fields
  body().custom((value) => {
    const keys = Object.keys(value || {});
    const invalidFields = keys.filter((key) => !allowedFields.includes(key));

    if (invalidFields.length > 0) {
      throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
    }

    return true;
  }),
];

// ================= DELETE FAQ BY ID VALIDATOR =================
const deleteFAQByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("FAQ ID is required")
    .isMongoId()
    .withMessage("Invalid FAQ ID"),
];

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

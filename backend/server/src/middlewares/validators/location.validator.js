const { body, param, query } = require("express-validator");

// allowed categories for get all locations (includes 'all' for filtering)
const allowedCategories = [
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
  "all",
];

// allowed statuses for get all locations (includes 'all' for filtering)
const allowedStatuses = ["active", "inactive", "all"];

// ============= ADD LOCATION VALIDATOR =============
const addLocationValidator = [
  body("location_name")
    .notEmpty()
    .withMessage("Location name is required")
    .isString()
    .withMessage("Location name must be a string")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location name must be between 3 and 100 characters"),

  body("location_description")
    .notEmpty()
    .withMessage("Location description is required")
    .isString()
    .withMessage("Location description must be a string")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Location description must be between 5 and 1000 characters"),

  body("location_category")
    .notEmpty()
    .withMessage("Location category is required")
    .isIn([
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
    ])
    .withMessage("Invalid location category"),

  body("location_status")
    .notEmpty()
    .withMessage("Location status is required")
    .isIn(["active", "inactive"])
    .withMessage("Invalid location status"),

  body("building")
    .notEmpty()
    .withMessage("Building is required")
    .isString()
    .withMessage("Building must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Building must be between 2 and 100 characters"),

  body("floor")
    .notEmpty()
    .withMessage("Floor is required")
    .isString()
    .withMessage("Floor must be a string")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Floor must be between 1 and 50 characters"),

  body("position.x")
    .notEmpty()
    .withMessage("Position X coordinate is required")
    .isNumeric()
    .withMessage("Position X must be numeric"),

  body("position.y")
    .notEmpty()
    .withMessage("Position Y coordinate is required")
    .isNumeric()
    .withMessage("Position Y must be numeric"),
];

// ============= UPDATE LOCATION BY ID VALIDATOR =============
const updateLocationByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Location id is required")
    .isMongoId()
    .withMessage("Invalid location id"),

  body("location_name")
    .notEmpty()
    .withMessage("Location name is required")
    .isString()
    .withMessage("Location name must be a string")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location name must be between 3 and 100 characters"),

  body("location_description")
    .notEmpty()
    .withMessage("Location description is required")
    .isString()
    .withMessage("Location description must be a string")
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage("Location description must be between 5 and 1000 characters"),

  body("location_category")
    .notEmpty()
    .withMessage("Location category is required")
    .isIn([
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
    ])
    .withMessage("Invalid location category"),

  body("location_status")
    .notEmpty()
    .withMessage("Location status is required")
    .isIn(["active", "inactive"])
    .withMessage("Invalid location status"),

  body("building")
    .notEmpty()
    .withMessage("Building is required")
    .isString()
    .withMessage("Building must be a string")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Building must be between 2 and 100 characters"),

  body("floor")
    .notEmpty()
    .withMessage("Floor is required")
    .isString()
    .withMessage("Floor must be a string")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Floor must be between 1 and 50 characters"),

  body("position.x")
    .notEmpty()
    .withMessage("Position X coordinate is required")
    .isNumeric()
    .withMessage("Position X must be numeric"),

  body("position.y")
    .notEmpty()
    .withMessage("Position Y coordinate is required")
    .isNumeric()
    .withMessage("Position Y must be numeric"),
];

// ================= CHANGE LOCATION STATUS BY ID VALIDATOR =================
const changeLocationStatusByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Location id is required")
    .isMongoId()
    .withMessage("Invalid location id"),

  body("location_status")
    .notEmpty()
    .withMessage("Location status is required")
    .isIn(["active", "inactive"])
    .withMessage("Invalid location status"),
];

// ============= DELETE LOCATION BY ID VALIDATOR =============
const deleteLocationByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Location id is required")
    .isMongoId()
    .withMessage("Invalid location id"),
];

// ============= ADMIN GET LOCATION BY ID VALIDATOR =============
const adminGetLocationByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Location id is required")
    .isMongoId()
    .withMessage("Invalid location id"),
];

// ============= GET ALL LOCATIONS =============
const getAllLocationsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),

  query("search").optional().isString().withMessage("Search must be a string"),

  query("location_category")
    .optional()
    .isIn(allowedCategories)
    .withMessage(
      `Location Category must be one of ${allowedCategories.join(", ")}`,
    ),

  query("location_status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage(
      `Location Status must be one of ${allowedStatuses.join(", ")}`,
    ),
];

// ============= GET LOCATION BY ID VALIDATOR (FOR STUDENTS) =============
const getLocationByIdValidator = [];

module.exports = {
  addLocationValidator,
  updateLocationByIdValidator,
  changeLocationStatusByIdValidator,
  deleteLocationByIdValidator,
  adminGetLocationByIdValidator,
  getAllLocationsValidator,
  getLocationByIdValidator,
};

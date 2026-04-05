const { body, param, query } = require("express-validator");

const departments = ["CS", "SE", "IT", "BBA", "EE"];
const degreeTypes = ["BS", "MS", "MPhil", "PhD"];
const programs = ["morning", "evening", "shifted", "bridging"];

const createStudentValidator = [
  body("name")
    .notEmpty()
    .withMessage("Student name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("registrationNumber")
    .notEmpty()
    .withMessage("Registration number is required")
    .matches(/^\d{4}-[A-Z]+-\d{5}$/)
    .withMessage("Registration number must be in format 2022-GCUF-02661")
    .trim()
    .toUpperCase(),

  body("semester")
    .notEmpty()
    .withMessage("Semester is required")
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isIn(departments)
    .withMessage(`Department must be one of ${departments.join(", ")}`),

  body("degreeType")
    .optional()
    .isIn(degreeTypes)
    .withMessage(`Degree type must be one of ${degreeTypes.join(", ")}`),

  body("degreeTitle")
    .optional()
    .isString()
    .withMessage("Degree title must be a string"),

  body("program")
    .optional()
    .isIn(programs)
    .withMessage(`Program must be one of ${programs.join(", ")}`),

  body("session").optional().isString().withMessage("Session must be a string"),
];

const updateStudentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID"),

  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("registrationNumber")
    .optional()
    .matches(/^\d{4}-[A-Z]+-\d{5}$/)
    .withMessage("Registration number must be in format 2022-GCUF-02661")
    .trim()
    .toUpperCase(),

  body("semester")
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage("Semester must be between 1 and 8"),

  body("department")
    .optional()
    .isIn(departments)
    .withMessage(`Department must be one of ${departments.join(", ")}`),

  body("degreeType")
    .optional()
    .isIn(degreeTypes)
    .withMessage(`Degree type must be one of ${degreeTypes.join(", ")}`),

  body("degreeTitle")
    .optional()
    .isString()
    .withMessage("Degree title must be a string"),

  body("program")
    .optional()
    .isIn(programs)
    .withMessage(`Program must be one of ${programs.join(", ")}`),

  body("session").optional().isString().withMessage("Session must be a string"),
];

const deleteStudentValidator = [
  param("id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID"),
];

const getStudentByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isMongoId()
    .withMessage("Invalid student ID"),
];

const getAllUsersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("search").optional().isString().withMessage("Search must be a string"),

  query("role")
    .optional()
    .isIn(["student", "admin", "all"])
    .withMessage("Role must be student, admin or all"),
];

const createAdminValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isIn(departments)
    .withMessage(`Department must be one of ${departments.join(", ")}`),

  body("designation")
    .optional()
    .isString()
    .withMessage("Designation must be a string"),
];

const getAdminByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Admin ID is required")
    .isMongoId()
    .withMessage("Invalid admin ID"),
];

module.exports = {
  createStudentValidator,
  updateStudentValidator,
  deleteStudentValidator,
  getStudentByIdValidator,
  getAllUsersValidator,
  createAdminValidator,
  getAdminByIdValidator,
};

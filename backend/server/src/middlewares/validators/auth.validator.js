const { body } = require("express-validator");
// Allowed departments (adjust as needed)
const departments = ["CS", "SE", "IT", "BBA", "EE"];

// ================= LOGIN VALIDATION RULES =================
const loginValidator = [
  // Either registrationNumber OR email must be provided
  body("registrationNumber")
    .optional({ checkFalsy: true }) // only validate if present
    .matches(/^\d{4}-[A-Z]+-\d{5}$/)
    .withMessage("Registration number must be in format 2022-GCUF-02661")
    .trim()
    .toUpperCase(),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail({gmail_remove_dots:false}),

  // Password is always required
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // Custom validator to ensure either registrationNumber OR email is present
  body().custom((value, { req }) => {
    if (!req.body.registrationNumber && !req.body.email) {
      throw new Error(
        "Either registration number (student) or email (admin) is required"
      );
    }
    return true;
  }),
];




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
    .normalizeEmail(),

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
    .normalizeEmail({gmail_remove_dots:false}),
];


const sendOtpValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail({ gmail_remove_dots: false }), // keeps dots in Gmail usernames
];


const verifyOtpValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP must be 4 digits")
    .matches(/^\d{4}$/)
    .withMessage("OTP must be numeric"),
];

const changePasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail({ gmail_remove_dots: false }),

  // Password is always required
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
module.exports = {
    loginValidator,
    createStudentValidator,
    createAdminValidator,
    sendOtpValidator,
    verifyOtpValidator,
    changePasswordValidator
}
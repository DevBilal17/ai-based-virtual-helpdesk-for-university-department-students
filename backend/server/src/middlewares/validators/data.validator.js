const { body, param, query } = require("express-validator");

const addDataValidator = [
  body("file_name")
    .notEmpty()
    .withMessage("File name is required")
    .isLength({ min: 3 })
    .withMessage("File name must be at least 3 characters"),

  body("file_description")
    .notEmpty()
    .withMessage("File description is required")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
];

const getAllDataValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

const deleteDataByIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("Data ID is required")
    .isMongoId()
    .withMessage("Invalid Data ID"),
];

module.exports = {
  addDataValidator,
  getAllDataValidator,
  deleteDataByIdValidator,
};

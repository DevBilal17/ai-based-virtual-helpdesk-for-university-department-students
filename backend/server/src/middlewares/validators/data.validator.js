const { body, param, query } = require("express-validator");

const addDataValidator = [
  body("file_name")
    .notEmpty()
    .withMessage("File name is required")
    .isString()
    .trim()
    .isLength({ min: 4, max: 100 })
    .withMessage("File name must be between 4 and 100 characters"),

  body("file_description")
    .notEmpty()
    .withMessage("File description is required")
    .isString()
    .trim()
    .isLength({ min: 4, max: 500 })
    .withMessage("File description must be between 4 and 500 characters"),
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

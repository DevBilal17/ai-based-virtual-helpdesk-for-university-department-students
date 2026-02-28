const { validationResult } = require("express-validator");
const response = require("../utils/response");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return response(
      res,
      400,
      false,
      "Validation Error",
      errors.array()
    );
  }

  next();
};

module.exports = validateRequest;
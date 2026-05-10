const { body, param, query } = require("express-validator");

// No specific validation rules for dashboard data retrieval as it's a simple GET request without parameters.
// However, you can add any necessary validation rules here if needed in the future.
// For example, if you want to allow filtering by date range or other parameters, you can add those validations here.
// Example:
// const getDashboardDataValidator = [
//   query("startDate").optional().isISO8601().withMessage("Start date must be a valid ISO 8601 date"),
//   query("endDate").optional().isISO8601().withMessage("End date must be a valid ISO 8601 date"),
// ];
const getDashboardDataValidator = [];

module.exports = { getDashboardDataValidator };

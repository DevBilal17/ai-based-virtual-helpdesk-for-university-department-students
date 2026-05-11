const express = require("express");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  getDashboardDataValidator,
} = require("../middlewares/validators/dashboard.validator");
const validateRequest = require("../middlewares/validateRequest");
const { getDashboardData } = require("../controllers/dashboard.controller");

const router = express.Router();

// ---------------------------------------------------------------------------------------

// Get dashboard data (admin only)
router.get(
  "/dashboard-data",
  protect,
  authorize("admin"),
  getDashboardDataValidator,
  validateRequest,
  getDashboardData,
);

module.exports = router;

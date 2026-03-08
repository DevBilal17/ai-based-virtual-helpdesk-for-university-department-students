const express = require("express");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  createStudentValidator,
  updateStudentValidator,
  deleteStudentValidator,
  createAdminValidator,
} = require("../middlewares/validators/user.validator");
const validateRequest = require("../middlewares/validateRequest");
const {
  createStudent,
  updateStudent,
  deleteStudent,
  createAdmin,
} = require("../controllers/user.controller");

const router = express.Router();

// Create Student Route
router.post(
  "/create-student",
  protect,
  authorize("admin"),
  createStudentValidator,
  validateRequest,
  createStudent,
);

// Update Student Route
router.put(
  "/update-student/:id",
  protect,
  authorize("admin"),
  updateStudentValidator,
  validateRequest,
  updateStudent,
);

// Delete Student Route
router.delete(
  "/delete-student/:id",
  protect,
  authorize("admin"),
  deleteStudentValidator,
  deleteStudent,
);

// Create Admin Route
router.post(
  "/create-admin",
  protect,
  authorize("admin"),
  createAdminValidator,
  validateRequest,
  createAdmin,
);

module.exports = router;

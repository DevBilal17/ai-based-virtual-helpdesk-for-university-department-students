const express = require("express");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  createStudentValidator,
  updateStudentValidator,
  deleteStudentValidator,
  getStudentByIdValidator,
  getAllStudentsValidator,
  createAdminValidator,
} = require("../middlewares/validators/user.validator");
const validateRequest = require("../middlewares/validateRequest");
const {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAllStudents,
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

// Update Student by id Route
router.put(
  "/update-student/:id",
  protect,
  authorize("admin"),
  updateStudentValidator,
  validateRequest,
  updateStudent,
);

// Delete Student by id Route
router.delete(
  "/delete-student/:id",
  protect,
  authorize("admin"),
  deleteStudentValidator,
  validateRequest,
  deleteStudent,
);

// Get Student by id Route
router.get(
  "/get-student/:id",
  protect,
  authorize("admin"),
  getStudentByIdValidator,
  validateRequest,
  getStudentById,
);

// Get all students Route
router.get(
  "/get-students",
  protect,
  authorize("admin"),
  getAllStudentsValidator,
  validateRequest,
  getAllStudents,
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

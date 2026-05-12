const express = require("express");
const imageUpload = require("../middlewares/multer/imageUpload");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  createUserValidator,
  updateUserByIdValidator,
  deleteUserByIdValidator,
  getUserByIdValidator,
  getAllUsersValidator,
  updateStudentProfileValidator,
} = require("../middlewares/validators/user.validator");
const validateRequest = require("../middlewares/validateRequest");
const {
  createUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getAllUsers,
  registerAdmin,
  updateStudentProfile,
} = require("../controllers/user.controller");

const router = express.Router();

// ---------------------------------------------------------------------------------------

// Create User Route
router.post(
  "/create-user",
  protect,
  authorize("admin"),
  createUserValidator,
  validateRequest,
  createUser,
);

// Update User by id Route
router.put(
  "/update-user/:id",
  protect,
  authorize("admin"),
  updateUserByIdValidator,
  validateRequest,
  updateUserById,
);

// Delete User by id Route
router.delete(
  "/delete-user/:id",
  protect,
  authorize("admin"),
  deleteUserByIdValidator,
  validateRequest,
  deleteUserById,
);

// Get User by id Route
router.get(
  "/get-user/:id",
  protect,
  authorize("admin", "student"),
  getUserByIdValidator,
  validateRequest,
  getUserById,
);

// Get all users Route
router.get(
  "/get-users",
  protect,
  authorize("admin"),
  getAllUsersValidator,
  validateRequest,
  getAllUsers,
);

// Update student profile image route (only students can update their profile image)
router.put(
  "/update-student-profile/:id",
  protect,
  authorize("student"),
  imageUpload.single("profileImage"),
  updateStudentProfileValidator,
  validateRequest,
  updateStudentProfile,
);

module.exports = router;

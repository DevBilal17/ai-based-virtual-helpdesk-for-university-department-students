const express = require("express");
const upload = require("../middlewares/upload");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  createUserValidator,
  updateUserByIdValidator,
  deleteUserByIdValidator,
  getUserByIdValidator,
  getAllUsersValidator,
} = require("../middlewares/validators/user.validator");
const validateRequest = require("../middlewares/validateRequest");
const {
  createUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getAllUsers,
} = require("../controllers/user.controller");

const router = express.Router();

// ---------------------------------------------------------------------------------------

// Create User Route
router.post(
  "/create-user",
  protect,
  authorize("admin"),
  upload.single("profileImage"), // handle file upload
  createUserValidator,
  validateRequest,
  createUser,
);

// Update User by id Route
router.put(
  "/update-user/:id",
  protect,
  authorize("admin"),
  upload.single("profileImage"), // handle file upload
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
  authorize("admin"),
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

// Create Admin Route
// router.post(
//   "/create-admin",
//   protect,
//   authorize("admin"),
//   upload.single("profileImage"), // handle file upload
//   createAdminValidator,
//   validateRequest,
//   createAdmin,
// );

// Get admin by id Route
// router.get(
//   "/get-admin/:id",
//   protect,
//   authorize("admin"),
//   getAdminByIdValidator,
//   validateRequest,
//   getAdminById,
// );

module.exports = router;

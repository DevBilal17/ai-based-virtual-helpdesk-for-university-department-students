const express = require("express");
const protect = require("../middlewares/protect.middleware");
const {
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  changePasswordValidator,
  adminChangePasswordValidator,
} = require("../middlewares/validators/auth.validator");
const validateRequest = require("../middlewares/validateRequest");
const {
  login,
  sendOtp,
  verifyOtp,
  changePassword,
  adminChangePassword,
  getProfile,
} = require("../controllers/auth.controller");
const { registerAdmin } = require("../controllers/user.controller");

const router = express.Router();

// User Login Route
router.post("/login", loginValidator, validateRequest, login);

// Send OTP Route
router.post("/send-otp", sendOtpValidator, validateRequest, sendOtp);

// Verify OTP Route
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);

// Student Change Password
router.post(
  "/change-password",
  changePasswordValidator,
  validateRequest,
  changePassword,
);

// Admin Change Password
router.post(
  "/admin-change-password",
  adminChangePasswordValidator,
  validateRequest,
  adminChangePassword,
);


// Register an admin
router.post("/register-admin", registerAdmin);

// ================= GET PROFILE =================
router.get("/profile",protect, getProfile);

module.exports = router;

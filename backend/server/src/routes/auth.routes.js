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
} = require("../controllers/auth.controller");

const router = express.Router();

// Login Student Route
router.post("/login", loginValidator, validateRequest, login);

// Send OTP Route
router.post("/send-otp", sendOtpValidator, validateRequest, sendOtp);

// Verify OTP Route
router.post("/verify-otp", verifyOtpValidator, validateRequest, verifyOtp);

// Change Password
router.post(
  "/change-password",
  changePasswordValidator,
  validateRequest,
  changePassword,
);

// admin change password
router.post(
  "/admin-change-password",
  adminChangePasswordValidator,
  validateRequest,
  adminChangePassword,
);

module.exports = router;

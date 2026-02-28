const express = require("express");
const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const { createStudentValidator, loginValidator, createAdminValidator, sendOtpValidator, verifyOtpValidator, changePasswordValidator } = require("../middlewares/validators/auth.validator");
const validateRequest = require("../middlewares/validateRequest");
const { createStudent, login, createAdmin, sendOtp, verifyOtp, changePassword } = require("../controllers/auth.controller");


const router = express.Router();


// Create Student Route
router.post(
    "/create-student",
    protect,
    authorize("admin"),
    createStudentValidator,
    validateRequest,
    createStudent
)

// Create Admin Route
router.post(
    "/create-admin",
    // protect,
    // authorize("admin"),
    createAdminValidator,
    validateRequest,
    createAdmin
)

// Login Student Route
router.post(
    "/login",
    loginValidator,
    validateRequest,
    login
)



// Send OTP Route
router.post(
    "/send-otp",
    sendOtpValidator,
    validateRequest,
    sendOtp
)


// Verify OTP Route
router.post(
    "/verify-otp",
    verifyOtpValidator,
    validateRequest,
    verifyOtp
)

// can add more security later
// Change Password
router.post(
    "/change-password",
    changePasswordValidator,
    validateRequest,
    changePassword
)


module.exports = router

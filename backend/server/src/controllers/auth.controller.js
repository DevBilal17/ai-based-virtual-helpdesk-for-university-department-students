
const response = require("../utils/response");
const User = require("../models/USER");
const { otpTemplate } = require("../utils/emailTemplates");
const { studentCredentialsTemplate } = require("../utils/emailTemplates");
const sendEmail = require("../utils/sendEmail");
const { adminCredentialsTemplate } = require("../utils/emailTemplates");
const generateToken = require("../utils/generateToken")
const crypto = require("crypto");
// ================= ADMIN CREATE STUDENT =================
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      semester,
      department,
    } = req.body;

    // Check existing
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 400, false, "Student already exists");
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    const student = await User.create({
      name,
      email,
      password: tempPassword,
      role: "student",
      registrationNumber,
      semester,
      department,
      isVerified: true,
    });

    // Prepare HTML template
    const htmlTemplate = studentCredentialsTemplate(
      student.name,
      student.email,
      tempPassword
    );

    // Send email
    const emailSent = await sendEmail({
      email: student.email,
      subject: "Your Student Account Credentials",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "Student created but email could not be sent"
      );
    }

    return response(
      res,
      201,
      true,
      "Student created successfully and credentials sent to email",
      {
        name : student.name
      }
    );

  } catch (error) {
    console.error("Create Student Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};



// ================= LOGIN WITH REGISTRATION NUMBER =================
const login = async (req, res) => {
  try {
    const { registrationNumber, email, password } = req.body;

    let user;

    // Determine role based on which field is provided
    if (registrationNumber) {
      // Student login
      user = await User.findOne({ registrationNumber }).select("+password");
      if (!user || user.role !== "student") {
        return response(res, 400, false, "Invalid credentials for student");
      }
    } else if (email) {
      // Admin login
      user = await User.findOne({ email }).select("+password");
      if (!user || user.role !== "admin") {
        return response(res, 400, false, "Invalid credentials for admin");
      }
    } else {
      return response(res, 400, false, "Provide registration number (student) or email (admin)");
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return response(res, 400, false, "Invalid credentials");
    }

    // Generate token
    const token = generateToken(user);

    // Response
    return response(res, 200, true, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        registrationNumber: user.registrationNumber || null,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};



// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response(res, 400, false, "Email is required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, false, "User not found with this email");
    }

    // Generate OTP using schema method
    const otp = user.generateOTP();

    // Save hashed OTP + expiry
    await user.save();

    // Send email
    const html = otpTemplate(user.name, otp);
    const emailSent = await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      html,
    });

    if (!emailSent) {
      return response(res, 500, false, "OTP generated but email could not be sent");
    }

    return response(res, 200, true, "OTP sent to your email");

  } catch (error) {
    console.error("Send OTP Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};


// ================= VERIFY OTP =================
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return response(res, 400, false, "Email and OTP are required");
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, false, "User not found with this email");
    }

    // Check if OTP exists and not expired
    if (!user.otp || !user.otpExpiry || user.otpExpiry < Date.now()) {
      return response(res, 400, false, "OTP is invalid or expired");
    }

    // Increment attempts and block if too many
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    if (user.otpAttempts > 5) {
      return response(res, 429, false, "Too many invalid OTP attempts. Try again later.");
    }

    // Hash the incoming OTP to compare with stored hash
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.otp) {
      await user.save(); // save updated attempts
      return response(res, 400, false, "Invalid OTP");
    }

    // OTP is valid → reset attempts & expiry
    user.otpAttempts = 0;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return response(res, 200, true, "OTP verified successfully");

  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};


// ================= Create Admin =================
const createAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return response(res, 400, false, "Admin already exists");
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    const admin = await User.create({
      name,
      email,
      password: tempPassword,
      role: "admin",
      isVerified: true,
    });

    // Prepare email template
    const htmlTemplate = adminCredentialsTemplate(
      admin.name,
      admin.email,
      tempPassword
    );

    // Send email
    const emailSent = await sendEmail({
      email: admin.email,
      subject: "Your Admin Account Credentials",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "Admin created but email could not be sent"
      );
    }

    return response(
      res,
      201,
      true,
      "Admin created successfully and credentials sent to email",
      {
        name: admin.name,
        email: admin.email
      }
    );

  } catch (error) {
    console.error("Create Admin Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= Change Password =================
const changePassword = async(req,res)=>{
  try {
    const {email,password} = req.body;

    if (!email || !password) {
      return response(res, 400, false, "Email and password are required");
    }
    // Check existence
    let user = await User.findOne({ email });
    if (!user) {
      return response(res, 400, false, "User not exist");
    }
    user.password = password;
    user.save()
    return response(res, 200, true, "Password reset successfully");
  } catch (error) {
    console.error("Create Admin Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
}



module.exports = {
  createStudent,
  login,
  sendOtp,
  createAdmin,
  verifyOtp,
  changePassword
}
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hide password in queries
    },

    // ================= ROLE =================
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // ================= STUDENT FIELDS =================
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true, 
      uppercase: true,
      trim: true,
    },

    semester: {
      type: Number,
      min: 1,
      max: 8,
    },

    department: {
      type: String,
      enum: ["CS", "SE", "IT", "BBA", "EE"],
      default:"IT"
    },

    // ================= OTP FIELDS =================
    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    otpAttempts: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// ================= PASSWORD HASH MIDDLEWARE =================
userSchema.pre("save", async function () {
  // Skip hashing if password is not modified
  if (!this.isModified("password")) return;

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw new Error(error); // will reject the save promise
  }
});


// ================= METHOD TO COMPARE PASSWORD =================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// ================= METHOD TO GENERATE OTP =================
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  this.otp = hashedOtp;
  this.otpExpiry = Date.now() + 5 * 60 * 1000; //5min
  this.otpAttempts = 0;

  return otp; 
};

const User = mongoose.model("User", userSchema);

module.exports = User
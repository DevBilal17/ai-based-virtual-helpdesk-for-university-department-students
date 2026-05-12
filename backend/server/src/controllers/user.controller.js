const response = require("../utils/response");
const User = require("../models/USER");
const {
  createUserEmailNotificationTemplate,
  updateUserEmailNotificationTemplate,
  deleteUserEmailNotificationTemplate,
} = require("../utils/emailTemplates");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");

// ================= CREATE USER =================
const createUser = async (req, res) => {
  try {
    const {
      role,
      name,
      email,
      department,
      designation,
      registrationNumber,
      degreeType,
      degreeTitle,
      semester,
      program,
      session,
    } = req.body;

    // ================= CHECK EXISTING USER =================
    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });
    if (existingUser) {
      return response(res, 400, false, "User already exists");
    }

    // ================= GENERATE TEMP PASSWORD =================
    const tempPassword = Math.random().toString(36).slice(-8);

    // ================= BUILD USER OBJECT =================
    let userData = {
      role,
      name,
      email,
      password: tempPassword,
      department,
      isVerified: true,
    };

    if (role === "admin") {
      userData.designation = designation;
    }

    if (role === "student") {
      userData = {
        ...userData,
        registrationNumber,
        degreeType,
        degreeTitle,
        semester,
        program,
        session,
      };
    }

    // ================= CREATE USER =================
    const user = await User.create(userData);

    // ================= PREPARE EMAIL TEMPLATE =================
    const htmlTemplate = createUserEmailNotificationTemplate(
      user,
      tempPassword,
    );

    // ================= SEND EMAIL =================
    const emailSent = await sendEmail({
      email: user.email,
      subject: "Your Account Credentials",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "User created but email could not be sent",
      );
    }

    // ================= REMOVE PASSWORD =================
    const userObject = user.toObject();
    delete userObject.password;

    // ================= RESPONSE =================
    return response(
      res,
      201,
      true,
      "User created successfully and credentials sent to email",
      {
        user: userObject,
      },
    );
  } catch (error) {
    console.error("Create User Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= UPDATE USER BY ID =================
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, false, "User not found");
    }

    const allowedFields = [
      "name",
      "email",
      "department",
      "designation",
      "registrationNumber",
      "degreeType",
      "degreeTitle",
      "semester",
      "program",
      "session",
    ];

    let finalUpdates = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        finalUpdates[field] = updates[field];
      }
    });

    if (Object.keys(finalUpdates).length === 0) {
      return response(res, 400, false, "No valid fields provided for update");
    }

    Object.assign(user, finalUpdates);

    await user.save();

    const htmlTemplate = updateUserEmailNotificationTemplate(user);

    const emailSent = await sendEmail({
      email: user.email,
      subject: "Your Account Information Has Been Updated",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "User updated but email could not be sent",
      );
    }

    return response(
      res,
      200,
      true,
      "User updated successfully and credentials sent to email",
      {
        user,
      },
    );
  } catch (error) {
    console.error("Update User Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= DELETE USER BY ID =================
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, false, "User not found");
    }

    // Prepare email notification before deletion
    const htmlTemplate = deleteUserEmailNotificationTemplate(user);

    // Send email notification
    const emailSent = await sendEmail({
      email: user.email,
      subject: "User Account Deletion Notification",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "Failed to send deletion notification email",
      );
    }

    // ================= DELETE PROFILE IMAGE FROM CLOUDINARY =================
    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // Delete user from database
    await user.deleteOne();

    return response(
      res,
      200,
      true,
      "User deleted successfully and notification sent to email",
    );
  } catch (error) {
    console.error("Delete User Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET USER BY ID =================
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // ================= VALIDATION =================
    if (!userId) {
      return response(res, 400, false, "User ID is required");
    }

    // ================= FIND USER =================
    const user = await User.findById(userId).select("-password");

    // ================= NOT FOUND =================
    if (!user) {
      return response(res, 404, false, "User not found");
    }

    // ================= SUCCESS =================
    return response(res, 200, true, "User fetched successfully", {
      user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error.message);

    // ================= INVALID OBJECT ID =================
    if (error.name === "CastError") {
      return response(res, 400, false, "Invalid user ID");
    }

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  try {
    // ================= QUERY PARAMS =================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const role = req.query.role || "all";
    const department = req.query.department || "all";

    const skip = (page - 1) * limit;

    // ================= FILTER OBJECT =================
    let filter = {};

    // Role filter
    if (role !== "all") {
      filter.role = role;
    }

    // Department filter
    if (department !== "all") {
      filter.department = department;
    }

    // Search filter (name, email, department)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ];
    }

    // ================= FETCH USERS =================
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    // ================= TOTAL COUNT =================

    // Total users in database (without filters)
    const totalUsers = await User.countDocuments();

    // Total users after applying filters/search
    const totalUsersFetched = await User.countDocuments(filter);

    // IMPORTANT:
    // total pages should ALWAYS be based on FILTERED Users
    const totalPages = Math.ceil(totalUsersFetched / limit) || 1;

    // ================= STATS =================
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Users added last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    // ================= RESPONSE =================
    return response(res, 200, true, "Users fetched successfully", {
      users,

      pagination: {
        // total users in database
        totalUsers,

        // total Users after applying filters/search
        totalUsersFetched,

        currentPage: page,
        totalPages,
        pageSize: limit,
      },
      stats: {
        totalUsers,
        totalUsersFetched,
        totalStudents,
        totalAdmins,
        usersLastMonth,
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= REGISTER ADMIN =================
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    // Check required fields
    if (!name || !email || !password || !department || !designation) {
      return response(res, 400, false, "All fields are required");
    }

    // Check existing admin
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response(res, 400, false, "Admin already exists");
    }

    // Create admin
    const admin = await User.create({
      name,
      email,
      password,
      department,
      designation,
      role: "admin",
    });

    return response(res, 201, true, "Admin created successfully", {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        designation: admin.designation,
      },
    });
  } catch (error) {
    console.error("Register Admin Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// only students can update their profile image
const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // ================= FIND USER =================
    const user = await User.findById(userId);

    if (!user) {
      return response(res, 404, false, "User not found");
    }

    // ================= STRICT ROLE CHECK =================
    if (user.role !== "student") {
      return response(
        res,
        403,
        false,
        "Only students can update profile image",
      );
    }

    // ================= STRICT SELF UPDATE ONLY =================
    if (req.user.id !== userId) {
      return response(
        res,
        403,
        false,
        "You can only update your own profile image",
      );
    }

    // ================= CHECK FILE =================
    if (!req.file) {
      return response(res, 400, false, "Profile image is required");
    }

    // ================= DELETE OLD IMAGE (IF EXISTS) =================
    if (user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(user.profileImage.public_id);
    }

    // ================= UPLOAD NEW IMAGE =================
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "virtual_helpdesk_files/users/profile_images",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      stream.end(req.file.buffer);
    });

    // ================= UPDATE USER =================
const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    profileImage: {
      url: result.secure_url,
      public_id: result.public_id,
    },
  },
  {
    new: true,
    runValidators: false,
  },
);

    // await user.save();

    return response(res, 200, true, "Profile image updated successfully", {
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Profile Image Update Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

module.exports = {
  createUser,
  updateUserById,
  deleteUserById,
  getUserById,
  getAllUsers,
  registerAdmin,
  updateStudentProfile,
};

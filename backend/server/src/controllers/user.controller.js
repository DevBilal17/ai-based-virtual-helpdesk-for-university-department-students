const response = require("../utils/response");
const User = require("../models/USER");
const {
  createStudentCredentialsTemplate,
  updateStudentCredentialsTemplate,
  deleteStudentNotificationTemplate,
  createAdminCredentialsTemplate,
} = require("../utils/emailTemplates");
const sendEmail = require("../utils/sendEmail");

// ================= CREATE STUDENT =================
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      semester,
      department,
      degreeType,
      degreeTitle,
      program,
      session,
    } = req.body;

    // Check if student already exists
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
      degreeType: degreeType || "BS",
      degreeTitle: degreeTitle || "",
      program: program || "morning",
      session: session || "",
      isVerified: true,
    });

    // Prepare HTML template
    const htmlTemplate = createStudentCredentialsTemplate(
      student.name,
      student.email,
      tempPassword,
      student.registrationNumber,
      student.degreeType,
      student.degreeTitle,
      student.semester,
      student.department,
      student.program,
      student.session,
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
        "Student created but email could not be sent",
      );
    }

    const studentObject = student.toObject();
    delete studentObject.password;

    return response(
      res,
      201,
      true,
      "Student created successfully and credentials sent to email",
      { studentObject },
    );
  } catch (error) {
    console.error("Create Student Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= UPDATE STUDENT BY ID =================
const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updates = req.body;

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return response(res, 404, false, "Student not found");
    }

    // Prevent changing role via update
    if (updates.role) delete updates.role;

    // Update student fields
    Object.keys(updates).forEach((key) => {
      student[key] = updates[key];
    });

    // Save updated student
    await student.save();

    // Prepare HTML Template
    const htmlTemplate = updateStudentCredentialsTemplate(
      student.name,
      student.email,
      student.registrationNumber,
      student.degreeType,
      student.degreeTitle,
      student.semester,
      student.department,
      student.program,
      student.session,
    );

    const emailSent = await sendEmail({
      email: student.email,
      subject: "Your Updated Student Account Information",
      html: htmlTemplate,
    });

    if (!emailSent) {
      return response(
        res,
        500,
        false,
        "Student updated but email could not be sent",
      );
    }

    return response(
      res,
      200,
      true,
      "Student updated successfully and credentials sent to email",
      { student },
    );
  } catch (error) {
    console.error("Update Student Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= DELETE STUDENT BY ID =================
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if student exists
    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return response(res, 404, false, "Student not found");
    }

    // Prepare email notification before deletion
    const htmlTemplate = deleteStudentNotificationTemplate(
      student.name,
      student.registrationNumber,
      student.email,
    );

    // Send email notification
    const emailSent = await sendEmail({
      email: student.email,
      subject: "Student Account Deletion Notification",
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

    // Delete student
    await student.deleteOne();

    return response(res, 200, true, "Student deleted successfully");
  } catch (error) {
    console.error("Delete Student Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET STUDENT BY ID =================
const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await User.findOne({
      _id: studentId,
      role: "student",
    }).select("-password");

    if (!student || student.role !== "student") {
      return response(res, 404, false, "Student not found");
    }

    return response(res, 200, true, "Student fetched successfully", {
      student,
    });
  } catch (error) {
    console.error("Get Student By ID Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ALL STUDENTS =================
const getAllStudents = async (req, res) => {
  try {
    // Extract query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // Total students count
    const totalStudents = await User.countDocuments({ role: "student" });

    // Fetch students with pagination
    const students = await User.find({ role: "student" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalStudents / limit);

    return response(res, 200, true, "Students fetched successfully", {
      students,
      pagination: {
        totalStudents,
        currentPage: page,
        totalPages,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Get All Students Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= CREATE ADMIN =================
const createAdmin = async (req, res) => {
  try {
    const { name, email, department, designation } = req.body;

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
      department,
      designation,
      isVerified: true,
    });

    // Prepare email template
    const htmlTemplate = createAdminCredentialsTemplate(
      admin.name,
      admin.email,
      tempPassword,
      admin.department,
      admin.designation,
    );

    // Send email
    const emailSent = await sendEmail({
      email: admin.email,
      subject: "Your Admin Account Credentials",
      html: htmlTemplate,
    });

    const adminObject = admin.toObject();
    delete adminObject.password;

    if (!emailSent) {
      console.error("Email sending failed for:", admin.email);

      return response(
        res,
        201,
        true,
        "Admin created but email could not be sent",
        { adminObject },
      );
    }

    return response(
      res,
      201,
      true,
      "Admin created successfully and credentials sent to email",
      { adminObject },
    );
  } catch (error) {
    console.error("Create Admin Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ADMIN BY ID =================
const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;

    const admin = await User.findOne({
      _id: adminId,
      role: "admin",
    }).select("-password");

    if (!admin || admin.role !== "admin") {
      return response(res, 404, false, "Admin not found");
    }

    return response(res, 200, true, "Admin fetched successfully", {
      admin,
    });
  } catch (error) {
    console.error("Get Admin By ID Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAllStudents,
  createAdmin,
  getAdminById,
};

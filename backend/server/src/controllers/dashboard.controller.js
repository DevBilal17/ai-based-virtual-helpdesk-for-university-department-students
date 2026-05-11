const response = require("../utils/response");
const User = require("../models/USER");
const Data = require("../models/DATA");
const FAQ = require("../models/FAQ");

// @desc    Get dashboard data (admin only)
// @route   GET /api/dashboard/dashboard-data
// @access  Private (admin only)
// @returns  Dashboard data including user stats, recent activities, etc.
const getDashboardData = async (req, res) => {
  try {
    // Total users in the database (without filters)
    const totalUsers = await User.countDocuments();

    // Total files in the database (without filters)
    const totalFiles = await Data.countDocuments();

    // Total faqs in the database (without filters)
    const totalFaqs = await FAQ.countDocuments();

    // Total active faqs in the database
    const totalActiveFaqs = await FAQ.countDocuments({ status: "active" });

    // ================= RESPONSE =================
    return response(res, 200, true, "Dashboard Data fetched successfully", {
      stats: {
        totalUsers,
        totalFiles,
        totalFaqs,
        totalActiveFaqs,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Data Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

module.exports = { getDashboardData };

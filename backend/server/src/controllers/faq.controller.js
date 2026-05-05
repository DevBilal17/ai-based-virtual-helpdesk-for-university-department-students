const response = require("../utils/response");
const FAQ = require("../models/FAQ");

// ================= ADD FAQ =================
const addFAQ = async (req, res) => {
  try {
    const { question, answer, category, status } = req.body;

    // ================= CHECK DUPLICATE QUESTION =================
    const existingFAQ = await FAQ.findOne({
      question: question.trim(),
    });

    if (existingFAQ) {
      return response(res, 400, false, "FAQ with this question already exists");
    }

    const newFAQ = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category,
      status,
      createdById: req.user.id,
      createdByName: req.user.name,
    });

    return response(res, 201, true, "FAQ added successfully", {
      faq: newFAQ,
    });
  } catch (error) {
    console.error("Add FAQ Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ALL FAQS =================
const getAllFAQS = async (req, res) => {
  try {
    // ================= QUERY PARAMS =================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const category = req.query.category || "all";
    const status = req.query.status || "all";

    const skip = (page - 1) * limit;

    // ================= FILTER OBJECT =================
    let filter = {};

    // Category filter
    if (category !== "all") {
      filter.category = category;
    }

    // Status filter
    if (status !== "all") {
      filter.status = status;
    }

    // Search filter (question and answer)
    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
      ];
    }

    // ================= FETCH FAQS =================
    const faqs = await FAQ.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // ================= TOTAL COUNT =================
    const totalFAQS = await FAQ.countDocuments();

    const totalFAQSFetched = await FAQ.countDocuments(filter);

    const totalPages = Math.ceil(totalFAQS / limit);

    // ================= STATS =================

    // FAQs added last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const faqsLastMonth = await FAQ.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    // ================= RESPONSE =================
    return response(res, 200, true, "FAQs fetched successfully", {
      faqs,
      pagination: {
        totalFAQS,
        currentPage: page,
        totalPages,
        pageSize: limit,
      },
      stats: {
        totalFAQS,
        totalFAQSFetched,
        faqsLastMonth,
      },
    });
  } catch (error) {
    console.error("Get All FAQs Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET FAQ BY ID =================
const getFAQById = async (req, res) => {
  try {
    const faqId = req.params.id;

    // ================= VALIDATION =================
    if (!faqId) {
      return response(res, 400, false, "FAQ ID is required");
    }

    // ================= FIND FAQ =================
    const faq = await FAQ.findById(faqId);

    // ================= NOT FOUND =================
    if (!faq) {
      return response(res, 404, false, "FAQ not found");
    }

    // ================= SUCCESS =================
    return response(res, 200, true, "FAQ fetched successfully", {
      faq,
    });
  } catch (error) {
    console.error("Get FAQ By ID Error:", error.message);

    // ================= INVALID OBJECT ID =================
    if (error.name === "CastError") {
      return response(res, 400, false, "Invalid FAQ ID");
    }

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= UPDATE FAQ BY ID =================
const updateFAQById = async (req, res) => {
  try {
    const faqId = req.params.id;
    const updates = req.body;

    const fetchedFAQ = await FAQ.findById(faqId);

    if (!fetchedFAQ) {
      return response(res, 404, false, "FAQ not found");
    }

    const allowedFields = ["question", "answer", "category", "status"];

    let finalUpdates = {};

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        finalUpdates[field] = updates[field];
      }
    });

    if (Object.keys(finalUpdates).length === 0) {
      return response(res, 400, false, "No valid fields provided for update");
    }

    Object.assign(fetchedFAQ, finalUpdates);

    await fetchedFAQ.save();

    return response(res, 200, true, "FAQ updated successfully", {
      faq: fetchedFAQ,
    });
  } catch (error) {
    console.error("Update FAQ Error:", error.message);
    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= DELETE FAQ BY ID =================
const deleteFAQById = async (req, res) => {
  try {
    const faqId = req.params.id;

    const faq = await FAQ.findById(faqId);

    if (!faq) {
      return response(res, 404, false, "FAQ not found");
    }

    await faq.deleteOne();

    return response(res, 200, true, "FAQ deleted successfully");
  } catch (error) {
    console.error("Delete FAQ Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= CHANGE FAQ STATUS BY ID =================
const changeFAQStatusById = async (req, res) => {
  try {
    const faqId = req.params.id;
    const { status } = req.body;

    // ================= FIND FAQ =================
    const faq = await FAQ.findById(faqId);

    if (!faq) {
      return response(res, 404, false, "FAQ not found");
    }

    // ================= UPDATE STATUS =================
    faq.status = status;

    await faq.save();

    return response(res, 200, true, "FAQ status updated successfully", {
      faq,
    });
  } catch (error) {
    console.error("Change FAQ Status Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET FAQS FOR STUDENTS =================
const getFAQS = async (req, res) => {};

module.exports = {
  addFAQ,
  getAllFAQS,
  getFAQById,
  updateFAQById,
  deleteFAQById,
  changeFAQStatusById,
  getFAQS,
};

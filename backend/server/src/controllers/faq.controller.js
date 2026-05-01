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
const getAllFAQS = async (req, res) => {};

// ================= GET FAQ BY ID =================
const getFAQById = async (req, res) => {};

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
const deleteFAQById = async (req, res) => {};

// ================= CHANGE FAQ STATUS BY ID =================
const changeFAQStatusById = async (req, res) => {};

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

const express = require("express");

const {
  addFAQ,
  getAllFAQS,
  getFAQById,
  updateFAQById,
  deleteFAQById,
  changeFAQStatusById,
  getFAQS,
} = require("../controllers/faq.controller");

const {
  addFAQValidator,
  getAllFAQSValidator,
  getFAQByIdValidator,
  updateFAQByIdValidator,
  deleteFAQByIdValidator,
  changeFAQStatusByIdValidator,
  getFAQSValidator,
} = require("../middlewares/validators/faq.validator");

const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// ================= ADD FAQ ROUTE =================
router.post(
  "/add-faq",
  protect,
  authorize("admin"),
  addFAQValidator,
  validateRequest,
  addFAQ,
);

// ================= GET ALL FAQS ROUTE =================
router.get(
  "/get-all-faqs",
  protect,
  authorize("admin"),
  getAllFAQSValidator,
  validateRequest,
  getAllFAQS,
);

// ================= GET FAQ BY ID ROUTE =================
router.get(
  "/get-faq/:id",
  protect,
  authorize("admin"),
  getFAQByIdValidator,
  validateRequest,
  getFAQById,
);

// ================= UPDATE FAQ BY ID ROUTE =================
router.put(
  "/update-faq/:id",
  protect,
  authorize("admin"),
  updateFAQByIdValidator,
  validateRequest,
  updateFAQById,
);

// ================= DELETE FAQ BY ID ROUTE =================
router.delete(
  "/delete-faq/:id",
  protect,
  authorize("admin"),
  deleteFAQByIdValidator,
  validateRequest,
  deleteFAQById,
);

// ================= CHANGE FAQ STATUS BY ID ROUTE =================
router.put(
  "/change-faq-status/:id",
  protect,
  authorize("admin"),
  changeFAQStatusByIdValidator,
  validateRequest,
  changeFAQStatusById,
);

// ================= GET FAQS FOR STUDENTS ROUTE =================
router.get("/get-faqs", protect, getFAQSValidator, validateRequest, getFAQS);

module.exports = router;

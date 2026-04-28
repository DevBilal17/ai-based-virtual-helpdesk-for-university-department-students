const express = require("express");

const {
  addData,
  getAllData,
  deleteDataById,
} = require("../controllers/data.controller");

const {
  addDataValidator,
  getAllDataValidator,
  deleteDataByIdValidator,
} = require("../middlewares/validators/data.validator");

const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const validateRequest = require("../middlewares/validateRequest");
const upload = require("../middlewares/multer/dataUpload");

const router = express.Router();

// ================= ADD DATA =================
router.post(
  "/add-data",
  protect,
  authorize("admin"),
  upload.single("file"),
  addDataValidator,
  validateRequest,
  addData,
);

// ================= GET ALL DATA =================
router.get(
  "/get-all-data",
  protect,
  authorize("admin"),
  getAllDataValidator,
  validateRequest,
  getAllData,
);

// ================= DELETE DATA =================
router.delete(
  "/delete-data/:id",
  protect,
  authorize("admin"),
  deleteDataByIdValidator,
  validateRequest,
  deleteDataById,
);

module.exports = router;

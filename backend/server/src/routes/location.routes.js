const express = require("express");

const {
  addLocation,
  updateLocationById,
  changeLocationStatusById,
  deleteLocationById,
  adminGetLocationById,
  getAllLocations,
  getLocationById,
} = require("../controllers/location.controller");

const {
  addLocationValidator,
  updateLocationByIdValidator,
  changeLocationStatusByIdValidator,
  deleteLocationByIdValidator,
  adminGetLocationByIdValidator,
  getAllLocationsValidator,
  getLocationByIdValidator,
} = require("../middlewares/validators/location.validator");

const protect = require("../middlewares/protect.middleware");
const authorize = require("../middlewares/authorization.middleware");
const validateRequest = require("../middlewares/validateRequest");
const imageUpload = require("../middlewares/multer/imageUpload");

const router = express.Router();

// -------------------------- ADMIN SPECIFIC ROUTES -------------------------------

// ================= ADD LOCATION ROUTE =================
router.post(
  "/add-location",
  protect,
  authorize("admin"),
  imageUpload.single("location_image"),
  addLocationValidator,
  validateRequest,
  addLocation,
);

// ================= UPDATE LOCATION BY ID ROUTE =================
router.put(
  "/update-location/:id",
  protect,
  authorize("admin"),
  imageUpload.single("location_image"),
  updateLocationByIdValidator,
  validateRequest,
  updateLocationById,
);

// ================= CHANGE LOCATION STATUS BY ID ROUTE =================
router.put(
  "/change-location-status/:id",
  protect,
  authorize("admin"),
  changeLocationStatusByIdValidator,
  validateRequest,
  changeLocationStatusById,
);

// ================= DELETE LOCATION BY ID ROUTE =================
router.delete(
  "/delete-location/:id",
  protect,
  authorize("admin"),
  deleteLocationByIdValidator,
  validateRequest,
  deleteLocationById,
);

// ================= ADMIN GET LOCATION BY ID ROUTE =================
router.get(
  "/admin-get-location/:id",
  protect,
  authorize("admin"),
  adminGetLocationByIdValidator,
  validateRequest,
  adminGetLocationById,
);

// ================= GET ALL LOCATIONS ROUTE =================
router.get(
  "/get-all-locations",
  protect,
  authorize("admin"),
  getAllLocationsValidator,
  validateRequest,
  getAllLocations,
);

// -------------------------- STUDENT SPECIFIC ROUTES -------------------------------

// ================= GET LOCATION BY ID ROUTE (FOR STUDENTS) =================
router.get(
  "/get-location/:id",
  protect,
  authorize("student"),
  getLocationByIdValidator,
  validateRequest,
  getLocationById,
);

module.exports = router;

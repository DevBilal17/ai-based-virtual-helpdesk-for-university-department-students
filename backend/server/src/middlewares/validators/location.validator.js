const { body, param, query } = require("express-validator");

// ============= ADD LOCATION VALIDATOR =============
const addLocationValidator = [];

// ============= UPDATE LOCATION BY ID VALIDATOR =============
const updateLocationByIdValidator = [];

// ============= DELETE LOCATION BY ID VALIDATOR =============
const deleteLocationByIdValidator = [];

// ============= ADMIN GET LOCATION BY ID VALIDATOR =============
const adminGetLocationByIdValidator = [];

// ============= GET ALL LOCATIONS =============
const getAllLocationsValidator = [];

// ============= GET LOCATION BY ID VALIDATOR (FOR STUDENTS) =============
const getLocationByIdValidator = [];

module.exports = {
  addLocationValidator,
  updateLocationByIdValidator,
  deleteLocationByIdValidator,
  adminGetLocationByIdValidator,
  getAllLocationsValidator,
  getLocationByIdValidator,
};

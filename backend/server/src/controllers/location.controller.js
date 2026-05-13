const response = require("../utils/response");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const LOCATION = require("../models/LOCATION");
// const axios = require("axios");
// const FormData = require("form-data");

// ================= ADD LOCATION =================
const addLocation = async (req, res) => {};

// ================= UPDATE LOCATION BY ID =================
const updateLocationById = async (req, res) => {};

// ================= DELETE LOCATION BY ID =================
const deleteLocationById = async (req, res) => {};

// ================= ADMIN GET LOCATION BY ID =================
const adminGetLocationById = async (req, res) => {};

// ================= GET ALL LOCATIONS =================
const getAllLocations = async (req, res) => {};

// ================= GET LOCATION BY ID (FOR STUDENTS) =================
const getLocationById = async (req, res) => {};

module.exports = {
  addLocation,
  updateLocationById,
  deleteLocationById,
  adminGetLocationById,
  getAllLocations,
  getLocationById,
};

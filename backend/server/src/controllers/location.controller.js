const response = require("../utils/response");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const LOCATION = require("../models/LOCATION");
const QRCode = require("qrcode");
// const axios = require("axios");
// const FormData = require("form-data");

// ================= ADD LOCATION =================
const addLocation = async (req, res) => {
  try {
    const {
      location_name,
      location_description,
      location_category,
      location_status,
      building,
      floor,
      position,
    } = req.body;

    // ================= CHECK IMAGE =================
    if (!req.file) {
      return response(res, 400, false, "Location image is required");
    }

    // ================= CHECK EXISTING LOCATION =================
    const existingLocation = await LOCATION.findOne({
      location_name: location_name.trim(),
    });

    if (existingLocation) {
      return response(
        res,
        409,
        false,
        "Location with this name already exists",
      );
    }

    // ================= UPLOAD LOCATION IMAGE =================
    const uploadLocationImage = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "virtual_helpdesk_files/locations/location_images",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadedLocationImage = await uploadLocationImage();

    // ================= CREATE LOCATION FIRST =================
    let newLocation = await LOCATION.create({
      location_name: location_name.trim(),
      location_description: location_description.trim(),
      location_category,
      location_status,
      location_image: uploadedLocationImage.secure_url,
      cloudinary_public_id: uploadedLocationImage.public_id,

      building: building.trim(),
      floor: floor.trim(),

      position: {
        x: Number(position.x),
        y: Number(position.y),
      },

      creator_id: req.user.id,
      creator_name: req.user.name,

      updater_id: req.user.id,
      updater_name: req.user.name,

      location_views: 0,

      // Temporary values
      location_qr: "temp",
      location_qr_public_id: "temp",
    });

    // ================= QR DATA =================
    const qrData = JSON.stringify({
      location_id: newLocation._id,
      location_name: newLocation.location_name,
      building: newLocation.building,
      floor: newLocation.floor,
    });

    // ================= GENERATE QR =================
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    // ================= CONVERT BASE64 TO BUFFER =================
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

    const qrBuffer = Buffer.from(base64Data, "base64");

    // ================= UPLOAD QR TO CLOUDINARY =================
    const uploadQRCode = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "virtual_helpdesk_files/locations/qr_codes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(qrBuffer).pipe(stream);
      });

    const uploadedQRCode = await uploadQRCode();

    // ================= UPDATE LOCATION WITH QR =================
    newLocation.location_qr = uploadedQRCode.secure_url;

    newLocation.location_qr_public_id = uploadedQRCode.public_id;

    await newLocation.save();

    // ================= SUCCESS RESPONSE =================
    return response(
      res,
      201,
      true,
      "Location added successfully and Location QR code generated successfully.",
      {
        newLocation,
      },
    );
  } catch (error) {
    console.error("Add Location Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= UPDATE LOCATION BY ID =================
const updateLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      location_name,
      location_description,
      location_category,
      location_status,
      building,
      floor,
      position,
    } = req.body;

    // ================= FIND LOCATION =================
    const existingLocation = await LOCATION.findById(id);

    if (!existingLocation) {
      return response(res, 404, false, "Location not found");
    }

    // ================= CHECK DUPLICATE LOCATION NAME =================
    const duplicateLocation = await LOCATION.findOne({
      location_name: location_name.trim(),
      _id: { $ne: id },
    });

    if (duplicateLocation) {
      return response(
        res,
        409,
        false,
        "Another location with this name already exists",
      );
    }

    // ================= HANDLE IMAGE UPDATE =================
    if (req.file) {
      // DELETE OLD IMAGE
      if (existingLocation.cloudinary_public_id) {
        await cloudinary.uploader.destroy(
          existingLocation.cloudinary_public_id,
        );
      }

      // UPLOAD NEW IMAGE
      const uploadNewLocationImage = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "virtual_helpdesk_files/locations/location_images",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadedLocationImage = await uploadNewLocationImage();

      existingLocation.location_image = uploadedLocationImage.secure_url;

      existingLocation.cloudinary_public_id = uploadedLocationImage.public_id;
    }

    // ================= UPDATE LOCATION FIELDS =================
    existingLocation.location_name = location_name.trim();

    existingLocation.location_description = location_description.trim();

    existingLocation.location_category = location_category;

    existingLocation.location_status = location_status;

    existingLocation.building = building.trim();

    existingLocation.floor = floor.trim();

    existingLocation.position = {
      x: Number(position.x),
      y: Number(position.y),
    };

    existingLocation.updater_id = req.user.id;

    existingLocation.updater_name = req.user.name;

    // ================= DELETE OLD QR =================
    if (existingLocation.location_qr_public_id) {
      await cloudinary.uploader.destroy(existingLocation.location_qr_public_id);
    }

    // ================= GENERATE NEW QR DATA =================
    const qrData = JSON.stringify({
      location_id: existingLocation._id,
      location_name: existingLocation.location_name,
      building: existingLocation.building,
      floor: existingLocation.floor,
    });

    // ================= GENERATE NEW QR =================
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    // ================= CONVERT BASE64 TO BUFFER =================
    const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, "");

    const qrBuffer = Buffer.from(base64Data, "base64");

    // ================= UPLOAD NEW QR =================
    const uploadQRCode = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "virtual_helpdesk_files/locations/qr_codes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(qrBuffer).pipe(stream);
      });

    const uploadedQRCode = await uploadQRCode();

    // ================= UPDATE QR FIELDS =================
    existingLocation.location_qr = uploadedQRCode.secure_url;

    existingLocation.location_qr_public_id = uploadedQRCode.public_id;

    // ================= SAVE UPDATED LOCATION =================
    await existingLocation.save();

    // ================= SUCCESS RESPONSE =================
    return response(
      res,
      200,
      true,
      "Location updated successfully and Location QR code updated successfully.",
      {
        updatedLocation: existingLocation,
      },
    );
  } catch (error) {
    console.error("Update Location Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= CHANGE LOCATION STATUS BY ID =================
const changeLocationStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    const { location_status } = req.body;

    // ================= FIND LOCATION =================
    const existingLocation = await LOCATION.findById(id);

    if (!existingLocation) {
      return response(res, 404, false, "Location not found");
    }

    // ================= UPDATE LOCATION STATUS =================
    existingLocation.location_status = location_status;

    // ================= UPDATE UPDATER INFO =================
    existingLocation.updater_id = req.user.id;

    existingLocation.updater_name = req.user.name;

    // ================= SAVE UPDATED LOCATION =================
    await existingLocation.save();

    // ================= SUCCESS RESPONSE =================
    return response(
      res,
      200,
      true,
      `Location status changed to ${location_status} successfully`,
      {
        updatedLocation: existingLocation,
      },
    );
  } catch (error) {
    console.error("Change Location Status Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= DELETE LOCATION BY ID =================
const deleteLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // ================= FIND LOCATION =================
    const existingLocation = await LOCATION.findById(id);

    if (!existingLocation) {
      return response(res, 404, false, "Location not found");
    }

    // ================= DELETE LOCATION IMAGE FROM CLOUDINARY =================
    if (existingLocation.cloudinary_public_id) {
      await cloudinary.uploader.destroy(existingLocation.cloudinary_public_id);
    }

    // ================= DELETE LOCATION QR FROM CLOUDINARY =================
    if (existingLocation.location_qr_public_id) {
      await cloudinary.uploader.destroy(existingLocation.location_qr_public_id);
    }

    // ================= DELETE LOCATION FROM DATABASE =================
    await existingLocation.deleteOne();

    // ================= SUCCESS RESPONSE =================
    return response(
      res,
      200,
      true,
      "Location deleted successfully and Location QR code deleted successfully.",
    );
  } catch (error) {
    console.error("Delete Location Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= ADMIN GET LOCATION BY ID =================
const adminGetLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    // ================= FIND LOCATION =================
    const location = await LOCATION.findById(id);

    if (!location) {
      return response(res, 404, false, "Location not found");
    }

    // ================= SUCCESS RESPONSE =================
    return response(res, 200, true, "Location fetched successfully", {
      location,
    });
  } catch (error) {
    console.error("Admin Get Location By Id Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ALL LOCATIONS =================
const getAllLocations = async (req, res) => {
  try {
    // ================= QUERY PARAMS =================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const search = req.query.search || "";
    const location_category = req.query.location_category || "all";
    const location_status = req.query.location_status || "all";

    // ================= PAGINATION =================
    const currentPage = Number(page);

    const itemsPerPage = Number(limit);

    const skip = (currentPage - 1) * itemsPerPage;

    // ================= FILTERS =================
    let filter = {};

    // ================= SEARCH =================
    if (search.trim()) {
      filter.$or = [
        {
          location_name: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          building: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          floor: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ================= LOCATION CATEGORY FILTER =================
    if (location_category !== "all") {
      filter.location_category = location_category;
    }

    // ================= LOCATION STATUS FILTER =================
    if (location_status !== "all") {
      filter.location_status = location_status;
    }

    // ================= GET LOCATIONS =================
    const locations = await LOCATION.find(filter)
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ updatedAt: -1 });

    // ================= TOTAL LOCATIONS (WITHOUT FILTERS) =================
    const totalLocations = await LOCATION.countDocuments();

    // ================= TOTAL LOCATIONS (AFTER APPLYING FILTERS) =================
    const totalLocationsFetched = await LOCATION.countDocuments(filter);

    // ================= TOTAL QR CODES =================
    const totalQRCodes = await LOCATION.countDocuments({
      location_qr: { $exists: true, $ne: "" },
    });

    // ================= PAGINATION =================
    const totalPages = Math.ceil(totalLocationsFetched / itemsPerPage) || 1;

    const pagination = {
      currentPage,
      totalPages,
      totalItems: totalLocationsFetched,
      itemsPerPage, // limit

      hasNextPage: currentPage < totalPages,

      hasPreviousPage: currentPage > 1,
    };

    // ================= STATS =================
    const stats = {
      totalLocations, // total locations in the system/database
      totalLocationsFetched, // total locations fetched after applying filters
      totalQRCodes, // total qr codes
    };

    // ================= SUCCESS RESPONSE =================
    return response(res, 200, true, "Locations fetched successfully", {
      locations,
      pagination,
      stats,
    });
  } catch (error) {
    console.error("Get All Locations Error:", error);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET LOCATION BY ID (FOR STUDENTS) =================
const getLocationById = async (req, res) => {};

module.exports = {
  addLocation,
  updateLocationById,
  changeLocationStatusById,
  deleteLocationById,
  adminGetLocationById,
  getAllLocations,
  getLocationById,
};

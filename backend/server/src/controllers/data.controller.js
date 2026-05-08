const response = require("../utils/response");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const DATA = require("../models/DATA");

// ================= ADD DATA =================
const addData = async (req, res) => {
  try {
    const { file_name, file_description } = req.body;

    if (!req.file) {
      return response(res, 400, false, "File is required");
    }

    // ================= CHECK DUPLICATE FILE NAME =================
    const existingFile = await DATA.findOne({
      file_name: file_name.trim(),
    });

    if (existingFile) {
      return response(res, 409, false, "File with same name already exists");
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "virtual_helpdesk_files",
            resource_type: "raw",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const uploadedFile = await uploadToCloudinary();

    const newData = await DATA.create({
      file_name: file_name.trim(),
      file_description,
      file_link: uploadedFile.secure_url,
      cloudinary_public_id: uploadedFile.public_id,
      uploaded_by_name: req.user.name,
      uploaded_by_id: req.user.id,
    });

    return response(res, 201, true, "File uploaded successfully", {
      data: newData,
    });
  } catch (error) {
    console.error("Add Data Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= GET ALL DATA =================
const getAllData = async (req, res) => {
  try {
    // ================= PAGINATION =================
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await DATA.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    const totalFiles = await DATA.countDocuments();

    // const totalFilesFetched = await DATA.countDocuments();

    const totalPages = Math.ceil(totalFiles / limit);

    // Files added last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const filesLastMonth = await DATA.countDocuments({
      createdAt: { $gte: lastMonth },
    });

    return response(res, 200, true, "Files fetched successfully", {
      files,
      pagination: {
        currentPage: page,
        totalPages,
        totalFiles,
        totalFilesFetched: totalFiles,
        filesPerPage: limit,
      },
      stats: {
        totalFiles,
        totalFilesFetched: totalFiles, // since we are not applying any filters/search, totalFilesFetched will be same as totalFiles
        filesLastMonth,
      },
    });
  } catch (error) {
    console.error("Get All Data Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

// ================= DELETE DATA =================
const deleteDataById = async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await DATA.findById(fileId);

    if (!file) {
      return response(res, 404, false, "File not found");
    }

    await cloudinary.uploader.destroy(file.cloudinary_public_id, {
      resource_type: "raw",
    });

    await file.deleteOne();

    return response(res, 200, true, "File deleted successfully");
  } catch (error) {
    console.error("Delete Data Error:", error.message);

    return response(res, 500, false, "Internal Server Error");
  }
};

module.exports = {
  addData,
  getAllData,
  deleteDataById,
};

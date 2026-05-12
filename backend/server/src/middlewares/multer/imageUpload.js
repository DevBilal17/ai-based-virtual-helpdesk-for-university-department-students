const multer = require("multer");

// Store in memory (same as documents - good for Cloudinary)
const storage = multer.memoryStorage();

// Allowed image types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (jpeg, jpg, png, webp, gif) are allowed"),
      false,
    );
  }
};

// Multer configuration
const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile images
  },
});

module.exports = uploadImage;

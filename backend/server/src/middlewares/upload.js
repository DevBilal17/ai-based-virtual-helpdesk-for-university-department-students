const multer = require("multer");

// Configure multer storage (in-memory)
const storage = multer.memoryStorage(); // store in memory (important)

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

module.exports = upload;

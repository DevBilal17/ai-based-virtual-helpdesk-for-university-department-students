const multer = require("multer");

const storage = multer.memoryStorage();

const allowedTypes = [
  // PDF
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // TXT
  "text/plain",

  // CSV
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel", // sometimes csv comes with this mimetype
];

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only pdf, doc, docx, xls, xlsx, txt, csv files are allowed"),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // file size max limit: 10 MB
  },
});

module.exports = upload;

const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const generateQRFile = async (filePath, url) => {
  await QRCode.toFile(filePath, url, {
    width: 300,
    margin: 2,
  });
};

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

module.exports = {
  generateQRFile,
  ensureDir,
};
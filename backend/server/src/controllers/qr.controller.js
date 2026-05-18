const path = require("path");
const rooms = require("../data/rooms");
const { generateQRFile, ensureDir } = require("../utils/qrGenerator");

const BASE_URL = "http://192.168.1.39:5173/navigation";

const generateAllQRs = async (req, res, next) => {
  try {
    const outputDir = path.join(__dirname, "../qr-codes");

    ensureDir(outputDir);

    const results = [];

    for (const room of rooms) {
      const url = `${BASE_URL}?nodeId=${room.doorNodeId}&intent=from`;

      const filePath = path.join(outputDir, `${room.id}.png`);

      await generateQRFile(filePath, url);

      results.push({
        room: room.name,
        file: filePath,
        url,
      });
    }

    res.status(200).json({
      success: true,
      message: "QR codes generated successfully",
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAllQRs,
};
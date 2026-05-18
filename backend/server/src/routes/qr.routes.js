const express = require("express");
const router = express.Router();

const { generateAllQRs } = require("../controllers/qr.controller");

// 🔥 single endpoint
router.get("/generate", generateAllQRs);

module.exports = router;
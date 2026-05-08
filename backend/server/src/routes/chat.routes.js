const express = require("express");
const router = express.Router();


const { handleUserQuery } = require("../controllers/chat.controller");
const protect = require("../middlewares/protect.middleware");

router.post("/ask", protect, handleUserQuery);

module.exports = router;
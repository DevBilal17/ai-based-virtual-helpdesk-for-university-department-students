const express = require("express");
const router = express.Router();


const { handleUserQuery, getAllChats, getRecentChats, getChatById } = require("../controllers/chat.controller");
const protect = require("../middlewares/protect.middleware");

router.post("/ask", protect, handleUserQuery);
router.get("/all",protect,getAllChats)
router.get("/recent",protect,getRecentChats)
router.get("/:chatId",protect,getChatById)


module.exports = router;
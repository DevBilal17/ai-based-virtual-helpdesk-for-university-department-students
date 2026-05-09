const Chat = require("../models/Chat");
const axios = require("axios");
const response = require("../utils/response"); 

const handleUserQuery = async (req, res) => {
  try {
    const { query, chatId } = req.body; // If chatId exists, we append to it
    const userId = req.user.id;

    if (!query) return response(res, 400, false, "Query is required");

    // 1. Call Python RAG Service
    const pythonResponse = await axios.post(`${process.env.PYTHON_URL}/query/ask`, {
      query: query,
    });

    if (!pythonResponse.data.success) {
      throw new Error("Python AI Service failed");
    }

    const aiData = pythonResponse.data.data; 
    // aiData now contains { answer: { answer, code, explanation, found_in_context }, sources: [...] }

    // 2. Prepare the messages
    const userMessage = { sender: "user", text: query };
    const botMessage = {
      sender: "bot",
      text: aiData.answer.answer,
      metadata: {
        sourceDocuments: aiData.sources,
        // Optional: you can also store the 'code' and 'explanation' in metadata
        code: aiData.answer.code,
        explanation: aiData.answer.explanation
      }
    };

    let chat;

    if (chatId) {
      // Continue existing conversation
      chat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: { $each: [userMessage, botMessage] } } },
        { new: true }
      );
    } else {
      // Start a brand new conversation
      chat = await Chat.create({
        userId: userId,
        title: query.substring(0, 30) + "...", // Auto-generate title from first query
        messages: [userMessage, botMessage],
      });
    }

    return response(res, 200, true, "AI Response generated", {
      chatId: chat._id,
      botResponse: botMessage,
    });

  } catch (error) {
    console.error("Chat Error:", error.message);
    return response(res, 500, false, "Internal Server Error", error.message);
  }
};


// GET: /api/chat/all
const getAllChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ userId })
      .select("_id title updatedAt messages")
      .sort({ updatedAt: -1 });

    return response(res, 200, true, "Chats fetched successfully", {
      chats,
    });

  } catch (error) {
    console.error("Get All Chats Error:", error.message);
    return response(res, 500, false, "Failed to fetch chats", error.message);
  }
};


// GET: /api/chat/recent
const getRecentChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ userId })
      .select("_id title updatedAt messages createdAt")
      .sort({ updatedAt: -1 })
      .limit(5);
    
    return response(res, 200, true, "Recent chats fetched successfully", {
      chats,
    });

  } catch (error) {
    console.error("Get Recent Chats Error:", error.message);
    return response(res, 500, false, "Failed to fetch recent chats", error.message);
  }
};


const getChatById = async (req, res) => {
  try {
    console.log("🔵 [GET CHAT BY ID] Request received");

    // 1. USER DEBUG
    const userId = req.user?.id;
    console.log("👤 User ID:", userId);

    // 2. PARAM DEBUG
    const { chatId } = req.params;
    console.log("💬 Chat ID:", chatId);

    if (!chatId) {
      console.log("❌ Missing chatId in params");
      return response(res, 400, false, "chatId is required");
    }

    if (!userId) {
      console.log("❌ Missing userId in request");
      return response(res, 401, false, "Unauthorized user");
    }

    // 3. DB QUERY START
    console.log("🟡 Fetching chat from DB...");

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    console.log("🟡 DB Query Completed");

    // 4. CHAT EXISTS CHECK
    if (!chat) {
      console.log("❌ Chat not found for this user");
      console.log("👉 Query params:", { chatId, userId });

      return response(res, 404, false, "Chat not found");
    }

    // 5. CHAT DATA DEBUG
    console.log("🟢 Chat found!");
    console.log("📦 Messages count:", chat.messages?.length || 0);
    console.log("📝 Chat Title:", chat.title);

    // 6. SAMPLE MESSAGE DEBUG (VERY IMPORTANT)
    if (chat.messages?.length > 0) {
      console.log("📌 First message sample:", chat.messages[0]);
    } else {
      console.log("⚠️ No messages in this chat");
    }

    // 7. FINAL RESPONSE DEBUG
    console.log("🚀 Sending response to frontend");

    console.log(chat)

    return response(res, 200, true, "Chat fetched successfully", {
      chat,
    });

  } catch (error) {
    console.log("🔥 ERROR IN getChatById:");
    console.log(error);

    return response(res, 500, false, "Error fetching chat", {
      error: error.message,
      stack: error.stack,
    });
  }
};



module.exports = { handleUserQuery,getAllChats,getRecentChats,getChatById };
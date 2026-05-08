const Chat = require("../models/Chat");
const axios = require("axios");
const response = require("../utils/response"); 

const handleUserQuery = async (req, res) => {
  try {
    const { query, chatId } = req.body; // If chatId exists, we append to it
    const userId = req.user.id;

    if (!query) return response(res, 400, false, "Query is required");

    // 1. Call Python RAG Service
    const pythonResponse = await axios.post("http://127.0.0.1:8000/query/ask", {
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
module.exports = { handleUserQuery };
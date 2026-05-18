const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const sendResponse = require("../utils/response");
const Chat = require("../models/Chat");
const getChatHistory = async (chatId) => {
  if (!chatId) return [];

  const chat = await Chat.findById(chatId).select("messages");

  if (!chat?.messages) return [];

  return chat.messages
    .slice(-4) // 👈 your choice (last 4)
    .map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
       matched_person: msg.metadata?.matched_person || null,
    }));
};
const processVoice = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, "No audio file uploaded");
    }

    const { chatId } = req.body;
    console.log(chatId);
    const userId = req.user.id;
    const filePath = req.file.path;
    const form = new FormData();
    const chatHistory = await getChatHistory(chatId);
    // Python FastAPI ko file forward karna
    form.append("file", fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append("chat_history", JSON.stringify(chatHistory));
    // FastAPI URL (Aapki existing service ka port)
    const pythonURL = `${process.env.PYTHON_URL}/voice/process`;

    const pythonRes = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      timeout: 30000, // 30 seconds timeout for AI processing
    });
    console.log(pythonRes);
    // Temp file delete karein
    fs.unlinkSync(filePath);
    const aiData = pythonRes.data.data;
    const userMessage = { sender: "user", text: aiData.transcription };
    const botMessage = {
      sender: "bot",
      text: aiData.reply,
      metadata: {
        sourceDocuments: aiData.sources || [],

        // core RAG flags
        found_in_context: aiData.found_in_context,
        needs_internet: aiData.needs_internet || false,

        // navigation system
        officeNodeId: aiData.officeNodeId || null,
        doorNodeId: aiData.doorNodeId || null,

        // AI understanding layer
        intent: aiData.intent || null,
        matched_person: aiData.matched_person || null,

        // academic insights
        publications_count: aiData.publications_count || null,

        // debugging/source
        source: "voice_rag",
      },
    };

    let chat;

    if (chatId) {
      // Continue existing conversation
      chat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: { $each: [userMessage, botMessage] } } },
        { new: true },
      );
    } else {
      // Start a brand new conversation
      chat = await Chat.create({
        userId: userId,
        title: aiData.transcription.substring(0, 30) + "...", // Auto-generate title from first query
        messages: [userMessage, botMessage],
      });
    }

    // Success Response
    return sendResponse(
      res,
      200,
      true,
      "Voice processed and transcribed",

      {
        aiData,
        chatId: chat._id,
        botResponse: botMessage,
      },
    );
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error("Voice Controller Error:", error.message);
    return sendResponse(
      res,
      500,
      false,
      "AI Service Connection Failed",
      error.message,
    );
  }
};

const processTextQuery = async (req, res) => {
  try {
    const { query, chatId, use_internet } = req.body;
    const userId = req.user.id;

    if (!query) {
      return sendResponse(res, 400, false, "Query is required");
    }
    const chatHistory = await getChatHistory(chatId);
    // 1. Send to Python backend (NO FILE)
    const pythonURL = `${process.env.PYTHON_URL}/voice/query/process`;

    const pythonRes = await axios.post(
      pythonURL,
      {
        query,
        use_internet: use_internet || false,
        chat_history: chatId ? chatHistory : [],
      },
      {
        timeout: 30000,
      }
    );

    const aiData = pythonRes.data.data;

    // 2. Chat messages
    const userMessage = {
      sender: "user",
      text: query,
    };

    const botMessage = {
      sender: "bot",
      text: aiData.answer?.answer || aiData.reply || "",
      metadata: {
        sourceDocuments: aiData.sources || [],

        found_in_context: aiData.answer?.found_in_context ?? true,
        needs_internet: aiData.answer?.needs_internet ?? false,

        officeNodeId: aiData.answer?.officeNodeId || null,
        doorNodeId: aiData.answer?.doorNodeId || null,

        intent: aiData.answer?.intent || null,
        matched_person: aiData.answer?.matched_person || null,

        publications_count: aiData.answer?.publications_count || null,

        source: "text_rag",
      },
    };

    // 3. Save chat
    let chat;

    if (chatId) {
      chat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            messages: { $each: [userMessage, botMessage] },
          },
        },
        { new: true }
      );
    } else {
      chat = await Chat.create({
        userId,
        title: query.substring(0, 30) + "...",
        messages: [userMessage, botMessage],
      });
    }

    // 4. Response (SAME FORMAT as voice → IMPORTANT)
    return sendResponse(res, 200, true, "Response generated", {
      aiData,
      chatId: chat._id,
      botResponse: botMessage,
    });
  } catch (error) {
    console.error("Text Query Error:", error.message);

    return sendResponse(
      res,
      500,
      false,
      "AI Service Failed",
      error.message
    );
  }
};


module.exports = { processVoice, processTextQuery };

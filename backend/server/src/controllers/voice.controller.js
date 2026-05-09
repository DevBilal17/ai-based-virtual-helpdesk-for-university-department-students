const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const sendResponse = require('../utils/response');
const Chat = require('../models/Chat');

const processVoice = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, "No audio file uploaded");
    }

    const {chatId} = req.body;
    console.log(chatId)
    const userId = req.user.id
    const filePath = req.file.path;
    const form = new FormData();
    
    // Python FastAPI ko file forward karna
    form.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // FastAPI URL (Aapki existing service ka port)
    const pythonURL = `${process.env.PYTHON_URL}/voice/process`;

    const pythonRes = await axios.post(pythonURL, form, {
      headers: { ...form.getHeaders() },
      timeout: 30000, // 15 seconds timeout for AI processing
    });
    console.log(pythonRes)
    // Temp file delete karein
    fs.unlinkSync(filePath);
    const aiData = pythonRes.data.data
    const userMessage = {sender : "user",text:aiData.transcription }
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
    }
      
    );

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error("Voice Controller Error:", error.message);
    return sendResponse(res, 500, false, "AI Service Connection Failed", error.message);
  }
};

module.exports = { processVoice };
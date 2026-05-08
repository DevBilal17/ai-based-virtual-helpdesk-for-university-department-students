const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    enum: ['user', 'bot'], 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  // RAG Specific
  metadata: {
    sourceDocuments: [String], // (RAG references) which file
    processingTime: Number,     // Python processing time
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const ChatSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    default: "New Conversation" 
  },
  messages: [MessageSchema], // Array of objects (Chat History)
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
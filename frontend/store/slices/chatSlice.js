import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeChatId: null,
  messages: [],
  isLoadingHistory: false,
  typingChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },

    clearChat: (state) => {
      state.activeChatId = null;
      state.messages = [];
      state.isLoadingHistory = false;
    },

    setLoadingHistory: (state, action) => {
      state.isLoadingHistory = action.payload;
    },

    setTypingChatId: (state, action) => {
  state.typingChatId = action.payload;
},
clearTypingChatId: (state) => {
  state.typingChatId = null;
},
  },
});

export const {
  setActiveChatId,
  setMessages,
  addMessage,
  clearChat,
  setLoadingHistory,
    setTypingChatId,
  clearTypingChatId,
} = chatSlice.actions;

export default chatSlice.reducer;
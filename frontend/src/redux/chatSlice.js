import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messagesMap: {},
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;

      if (!state.messagesMap) state.messagesMap = {};

      if (userId && messages) {
        // Ensure messages are stored only for the specific conversation ID
        state.messagesMap[userId] = messages;
      }
    },
    addMessage: (state, action) => {
      const { userId, message } = action.payload;

      if (!state.messagesMap[userId]) {
        state.messagesMap[userId] = [];
      }

      // Check if message already exists to avoid duplicates
      if (!state.messagesMap[userId].some((msg) => msg._id === message._id)) {
        state.messagesMap[userId].push(message);
      }
    },
  },
});

export const { setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

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
        state.messagesMap[userId] = messages;
      }
    },
  },
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;

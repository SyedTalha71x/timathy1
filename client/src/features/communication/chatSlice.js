import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as chatApi from './chatApi'

// ------------------ THUNKS ------------------

// Access or create private chat
export const accessChatThunk = createAsyncThunk(
  'chat/accessChat',
  async (userData, { rejectWithValue }) => {
    try {
      return await chatApi.accessChat(userData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Create group chat
export const createGroupThunk = createAsyncThunk(
  'chat/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      return await chatApi.createGroup(groupData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Send message
export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      return await chatApi.sendMessage(messageData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Fetch all messages
export const fetchMessagesThunk = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      return await chatApi.allMessage(chatId)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ------------------ SLICE ------------------

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    activeChat: null,
    messages: [],
    loading: false,
    error: null
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    receiveSocketMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder

      // Access Chat
      .addCase(accessChatThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(accessChatThunk.fulfilled, (state, action) => {
        state.loading = false
        const chat = action.payload.chat

        state.activeChat = chat

        const exists = state.chats.find(c => c._id === chat._id)
        if (!exists) {
          state.chats.push(chat)
        }
      })
      .addCase(accessChatThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Group
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        state.chats.push(action.payload.chat)
      })

      // Fetch Messages
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.messages = action.payload.message
      })

      // Send Message
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages.push(action.payload.fullMessage)
      })
  }
})

export const { setActiveChat, clearMessages, receiveSocketMessage } = chatSlice.actions
export default chatSlice.reducer
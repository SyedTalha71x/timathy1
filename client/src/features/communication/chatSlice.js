import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as chatApi from './chatApi'

// ------------------ THUNKS ------------------

// Access or create private chat
export const accessChatThunk = createAsyncThunk(
  'chat/accessChat',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await chatApi.accessChat(userData)
      return res.chat

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
      const res = await chatApi.createGroup(groupData)
      return res.chat
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
      const res = await chatApi.sendMessage(messageData)
      return res.fullMessage
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
      const res = await chatApi.allMessage(chatId)
      return res.messages
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// access studio chat - member
export const accessStudioChatThunk = createAsyncThunk('/chat/studio/access-chat', async (chatData, { rejectWithValue }) => {
  try {
    const res = await chatApi.accessStudioChat(chatData);
    return res.chat
  }
  catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

// fetch studio chat
export const fetchStudioChatThunk = createAsyncThunk('/chat/studio/fetch-chat', async (_, { rejectWithValue }) => {
  try {
    const res = await chatApi.fetchStudioChat();
    return res.chats
  }
  catch (error) {
    return rejectWithValue(error.response?.data)
  }
})



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
      // Access studio Chat
      .addCase(accessStudioChatThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(accessStudioChatThunk.fulfilled, (state, action) => {
        state.loading = false
        const chat = action.payload

        state.activeChat = chat

        const exists = state.chats.find(c => c._id === chat._id)
        if (!exists) {
          state.chats.push(chat)
        }
      })
      .addCase(accessStudioChatThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create Group
      .addCase(createGroupThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(createGroupThunk.fulfilled, (state, action) => {
        state.chats = action.payload
      })
      .addCase(createGroupThunk.rejected, (state, action) => {
        state.error = action.payload?.message
      })

      // Fetch Messages
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.error = action.payload?.message
      })

      // Send Message
      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      .addCase(sendMessageThunk.rejected, (state, action) => {
        state.error = action.payload?.message
      })

      // FETCH STUDIO CHATS 
      .addCase(fetchStudioChatThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchStudioChatThunk.fulfilled, (state, action) => {
        state.chats = action.payload
      })
      .addCase(fetchStudioChatThunk.rejected, (state, action) => {
        state.error = action.payload?.message
      })


  }
})

export const { setActiveChat, clearMessages, receiveSocketMessage } = chatSlice.actions
export default chatSlice.reducer
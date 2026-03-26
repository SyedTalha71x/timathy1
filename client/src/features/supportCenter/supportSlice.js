
import * as supportApi from './supportApi'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// +++++++++++
// All feedback Thunks
// ++++++++++++++++


// +++++ create Feedback Thunk ++++++++

export const createFeedbackThunk = createAsyncThunk('/support/feedback/create-feedback', async (data, { rejectWithValue }) => {
    try {
        const res = await supportApi.createFeedbackApi(data)
        return res.feedback
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// ++++++++ fetch Feedback Thunk ++++++++

export const fetchFeedbackThunk = createAsyncThunk('/support/feedback/get-feedback', async (_, { rejectWithValue }) => {
    try {
        const res = await supportApi.fetchFeedbackApi()
        return res.feedback
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// ***********
// ALL TICKETS THUNK
// **************

// ****** create Ticket *******

export const createTicketThunk = createAsyncThunk('/support/ticket/create-ticket', async (data, { rejectWithValue }) => {
    try {
        const res = await supportApi.createTicketApi(data)
        return res.ticket
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ****** get Ticket *******

export const fetchTicketThunk = createAsyncThunk('/support/ticket/get-ticket', async (_, { rejectWithValue }) => {
    try {
        const res = await supportApi.fetchTicketApi()
        return res.ticket
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ****** update Ticket *******

export const updateTicketThunk = createAsyncThunk('/support/ticket/update-ticket', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await supportApi.updateTicketApi(id, updateData)
        return res.ticket
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ****** Delete Ticket *******

export const deleteTicketThunk = createAsyncThunk('/support/ticket/delete-ticket', async (id, { rejectWithValue }) => {
    try {
        const res = await supportApi.deleteTicketApi(id)
        return res.ticket
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ****** isClosed Ticket *******

export const isClosedTicketThunk = createAsyncThunk('/support/ticket/close-ticket', async (id, { rejectWithValue }) => {
    try {
        const res = await supportApi.isClosedTicketApi(id)
        return res.ticket
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




const supportSlice = createSlice({
    name: 'support',
    initialState: {
        feedback: [],
        ticket: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ---------
            // all feedBack Slices
            // ----------

            // ---- create feedback Slice
            .addCase(createFeedbackThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createFeedbackThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback = action.payload
            })
            .addCase(createFeedbackThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---- get feedback Slice
            .addCase(fetchFeedbackThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchFeedbackThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.feedback = action.payload
            })
            .addCase(fetchFeedbackThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---------
            // all Ticket Slices
            // ----------

            // ---- create feedback Slice
            .addCase(createTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload
            })
            .addCase(createTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---- get ticket Slice
            .addCase(fetchTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload
            })
            .addCase(fetchTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---- update ticket Slice
            .addCase(updateTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload
            })
            .addCase(updateTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---- delete ticket Slice
            .addCase(deleteTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload
            })
            .addCase(deleteTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ---- closed ticket Slice
            .addCase(isClosedTicketThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(isClosedTicketThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.ticket = action.payload
            })
            .addCase(isClosedTicketThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export default supportSlice.reducer
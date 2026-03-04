import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as leadApi from './leadApi'



export const createLeadThunk = createAsyncThunk('/lead/create', async (leadData, { rejectWithValue }) => {
    try {
        const res = await leadApi.createLead(leadData)
        return res.lead;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const fetchAllLeadsThunk = createAsyncThunk('/fetch/lead/all', async (_, { rejectWithValue }) => {
    try {
        const res = await leadApi.fetchAllLeads()
        return res.lead;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



const leadSlice = createSlice({
    name: 'lead',
    initialState: {
        leads: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createLeadThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLeadThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload
            })
            .addCase(createLeadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(fetchAllLeadsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllLeadsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload
            })
            .addCase(fetchAllLeadsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})


export default leadSlice.reducer;
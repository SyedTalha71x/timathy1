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
export const updateLeadByStaffThunk = createAsyncThunk('/lead/updateByStaff', async ({ leadId, leadData }, { rejectWithValue }) => {
    try {
        const res = await leadApi.updateLeadDataByStaff(leadId, leadData)
        return res.lead;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const fetchAllLeadsThunk = createAsyncThunk('/fetch/lead/lead-all', async (_, { rejectWithValue }) => {
    try {
        const res = await leadApi.fetchAllLeads()
        return res.leads;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



const leadSlice = createSlice({
    name: 'lead',
    initialState: {
        leads: [],
        leadFilters: [],
        loading: false,
        error: null
    },
    reducers: {
        setLeadFilters: (state, action) => {
            state.leadFilters = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // ================= Create Lead ==================
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

            // ========= Update Lead Thunk By Staff ============

            .addCase(updateLeadByStaffThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLeadByStaffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload
            })
            .addCase(updateLeadByStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // ================= Fetch All Leads ==================
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

export const { setLeadFilters } = leadSlice.actions;
export default leadSlice.reducer;
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

export const fetchLeadSourcesThunk = createAsyncThunk('/lead/sources-all', async (_, { rejectWithValue }) => {
    try {
        const res = await leadApi.getLeadSourcesApi()
        return res.sources
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const createLeadSourcesThunk = createAsyncThunk('/lead/sources/create-source', async (data, { rejectWithValue }) => {
    try {
        const res = await leadApi.createLeadSourcesApi(data)
        return res.source
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const updateLeadSourcesThunk = createAsyncThunk('/lead/sources/update-source', async ({ sourceId, updateData }, { rejectWithValue }) => {
    try {
        const res = await leadApi.updateLeadSourcesApi(sourceId, updateData)
        return res.source
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteLeadSourcesThunk = createAsyncThunk('/lead/sources/delete-source', async (sourceId, { rejectWithValue }) => {
    try {
        const res = await leadApi.deleteLeadSourcesApi(sourceId)
        return { message: res.message, sourceId }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const leadSlice = createSlice({
    name: 'lead',
    initialState: {
        leads: [],
        leadSources: [],
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
                state.leads.push(action.payload); // Add new lead to array
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
                const index = state.leads.findIndex(lead => lead.id === action.payload.id);
                if (index !== -1) {
                    state.leads[index] = action.payload; // Update existing lead
                }
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
                state.leads = action.payload // Replace with fetched leads
            })
            .addCase(fetchAllLeadsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // ++++++++++++ Lead sources +++++++++++++++++
            .addCase(fetchLeadSourcesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLeadSourcesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leadSources = action.payload // Replace with fetched sources
            })
            .addCase(fetchLeadSourcesThunk.rejected, (state, action) => { // FIXED: Correct thunk reference
                state.loading = false;
                state.error = action.payload?.message
            })
            
            .addCase(createLeadSourcesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLeadSourcesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leadSources.push(action.payload); // Add new source to array
            })
            .addCase(createLeadSourcesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            .addCase(updateLeadSourcesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLeadSourcesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.leadSources.findIndex(source => source.id === action.payload.id);
                if (index !== -1) {
                    state.leadSources[index] = action.payload; // Update existing source
                }
            })
            .addCase(updateLeadSourcesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            
            .addCase(deleteLeadSourcesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLeadSourcesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.leadSources = state.leadSources.filter(source => source.id !== action.payload.sourceId); // Remove deleted source
            })
            .addCase(deleteLeadSourcesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export const { setLeadFilters } = leadSlice.actions;
export default leadSlice.reducer;
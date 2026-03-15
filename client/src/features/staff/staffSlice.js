import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as staffApi from './staffApi';

// ==================================
// fetch All Staff Data Thunk
// ==================================
export const fetchAllStaffThunk = createAsyncThunk('/staff/all', async (_, { rejectWithValue }) => {
    try {
        const res = await staffApi.allStaffData()
        return res.staff
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// ===================================
// create Staff Thunk
// ===================================

export const createStaffThunk = createAsyncThunk('/staff/create/new', async (staffData, { rejectWithValue }) => {
    try {
        const res = await staffApi.createStaff(staffData)
        return res.staff;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// ==================
// update Staff Details
// ====================

export const updateStaffThunk = createAsyncThunk('/staff/update', async ({ staffId, updateData }, { rejectWithValue }) => {
    try {
        const res = await staffApi.updateStaff(staffId, updateData)
        return res.staff;
    }
    catch (error) {
        return rejectWithValue(error.response?.message)
    }
})




const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staff: [],
        loading: false,
        error: null
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            // =====================
            // All Staff Data reducer
            // =====================
            .addCase(fetchAllStaffThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchAllStaffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(fetchAllStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ====================
            // create staff reducer
            // =====================
            .addCase(createStaffThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createStaffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(createStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ========================
            // update staff reducer
            // ========================
            .addCase(updateStaffThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateStaffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(updateStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})



export default staffSlice.reducer
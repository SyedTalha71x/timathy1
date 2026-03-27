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
// update Staff Details by Admin/Staff
// ====================

export const updateStaffThunk = createAsyncThunk('/staff/update-by-staff', async ({ staffId, updateData }, { rejectWithValue }) => {
    try {
        const res = await staffApi.updateStaff(staffId, updateData)
        return res.staff;
    }
    catch (error) {
        return rejectWithValue(error.response?.message)
    }
})
// ===============
// update Login staff himself
// ======================

export const updateLoggedInStaffThunk = createAsyncThunk('/staff/update', async (updateData, { rejectWithValue }) => {
    try {
        const res = await staffApi.updateStaffByUserID(updateData);
        return res.staff
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// ********************
// CREATE SHIFT
// ********************

export const createShiftThunk = createAsyncThunk('/staff/shift/create-shift', async (data, { rejectWithValue }) => {
    try {
        const res = await staffApi.createShift(data)
        return res.shift
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ********************
// update SHIFT
// ********************

export const updateShiftThunk = createAsyncThunk('/staff/shift/update-shift', async ({ id, update }, { rejectWithValue }) => {
    try {
        const res = await staffApi.updateShift(id, update)
        return res.shift
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ********************
// Delete SHIFT
// ********************

export const deleteShiftThunk = createAsyncThunk('/staff/shift/delete-shift', async (id, { rejectWithValue }) => {
    try {
        const res = await staffApi.deleteShift(id)
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ********************
// Checked In SHIFT
// ********************

export const checkedInShiftThunk = createAsyncThunk('/staff/shift/checkedIn-shift', async (id, { rejectWithValue }) => {
    try {
        const res = await staffApi.checkedIn(id)
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ********************
// Get SHIFT
// ********************

export const getShiftThunk = createAsyncThunk('/staff/shift/get-shift', async (_, { rejectWithValue }) => {
    try {
        const res = await staffApi.getShift()
        return res.shift
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// &&&&&&&&&&&&&&&&&&
// Vacation Thunks
// &&&&&&&&&&&&&&&&&&&&&

// &&&&&&&
// Send Vacation Request
// &&&&&&&&&&&

export const sendVacationRequestThunk = createAsyncThunk('/staff/vacation/send-vacation-request', async (data, { rejectWithValue }) => {
    try {
        const res = await staffApi.sendVacationRequestApi(data);
        return res.vacation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// &&&&&&&
// approved Vacation Request
// &&&&&&&&&&&

export const approvedVacationRequestThunk = createAsyncThunk('/staff/vacation/approved-vacation-request', async (id, { rejectWithValue }) => {
    try {
        const res = await staffApi.approvedVacationRequestApi(id);
        return res.vacation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// &&&&&&&
// Rejected Vacation Request
// &&&&&&&&&&&

export const rejectedVacationRequestThunk = createAsyncThunk('/staff/vacation/reject-vacation-request', async (id, { rejectWithValue }) => {
    try {
        const res = await staffApi.rejectVacationRequestApi(id);
        return res.vacation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// &&&&&&&
// get all Vacation 
// &&&&&&&&&&&

export const fetchVacationThunk = createAsyncThunk('/staff/vacation/fetch-vacation', async (_, { rejectWithValue }) => {
    try {
        const res = await staffApi.getVacationRequestsApi();
        return res.vacation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// &&&&&&&
// Get Pending Vacation Request
// &&&&&&&&&&&

export const fetchPendingVacationRequestThunk = createAsyncThunk('/staff/vacation/pending-vacation-request', async (_, { rejectWithValue }) => {
    try {
        const res = await staffApi.getPendingVacationRequestsApi();
        return res.vacation
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})





const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staff: [],
        shift: [],
        vacations: [],
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
            // update staff by Staff/Admin reducer
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
            // ========================
            // update loggedIn staff
            // ========================
            .addCase(updateLoggedInStaffThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateLoggedInStaffThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(updateLoggedInStaffThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ***********************
            // CREATE SHIFT FOR STAFF
            // ***********************
            .addCase(createShiftThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createShiftThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.shift = action.payload;
            })
            .addCase(createShiftThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ***********************
            // UPDATE SHIFT FOR STAFF
            // ***********************
            .addCase(updateShiftThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateShiftThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.shift = action.payload;
            })
            .addCase(updateShiftThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ***********************
            // DELETE SHIFT FOR STAFF
            // ***********************
            .addCase(deleteShiftThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteShiftThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.shift = action.payload;
            })
            .addCase(deleteShiftThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ***********************
            // GET SHIFT FOR STAFF
            // ***********************
            .addCase(getShiftThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getShiftThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.shift = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(getShiftThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // ***********************
            // CHECKED-IN  SHIFT FOR STAFF
            // ***********************
            .addCase(checkedInShiftThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(checkedInShiftThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.shift = action.payload;
            })
            .addCase(checkedInShiftThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // &&&&&&&&&&&&&&&&&
            // VACATION SLICE
            // &&&&&&&&&&&&&&&&&

            .addCase(sendVacationRequestThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(sendVacationRequestThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacations = action.payload;
                state.error = null
            })
            .addCase(sendVacationRequestThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // &&&&&&&&&&&&&&&&&
            // APPROVED VACATION  SLICE
            // &&&&&&&&&&&&&&&&&

            .addCase(approvedVacationRequestThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(approvedVacationRequestThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacations = action.payload;
                state.error = null
            })
            .addCase(approvedVacationRequestThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // &&&&&&&&&&&&&&&&&
            // REJECTED VACATION SLICE
            // &&&&&&&&&&&&&&&&&

            .addCase(rejectedVacationRequestThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(rejectedVacationRequestThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacations = action.payload;
                state.error = null
            })
            .addCase(rejectedVacationRequestThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // &&&&&&&&&&&&&&&&&
            // GET VACATION SLICE
            // &&&&&&&&&&&&&&&&&

            .addCase(fetchVacationThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchVacationThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacations = action.payload;
                state.error = null
            })
            .addCase(fetchVacationThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // &&&&&&&&&&&&&&&&&
            // Pending VACATION SLICE
            // &&&&&&&&&&&&&&&&&

            .addCase(fetchPendingVacationRequestThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchPendingVacationRequestThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.vacations = action.payload;
                state.error = null
            })
            .addCase(fetchPendingVacationRequestThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })




    }
})



export default staffSlice.reducer
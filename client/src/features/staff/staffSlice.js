import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as staffApi from './staffApi';



export const fetchAllStaffThunk = createAsyncThunk('/staff/all', async (_, { rejectWithValue }) => {
    try {
        const res = await staffApi.allStaffData()
        return res.staff
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
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
            // All Staff Data
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
    }
})



export default staffSlice.reducer
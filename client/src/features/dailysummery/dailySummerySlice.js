import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as dailySummeryApi from './dailySummeryApi';


export const fetchDailySummery = createAsyncThunk('/fetch/daily-summery', async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
    try {
        const res = await dailySummeryApi.dailySummery();
        return res.dailylog;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


const dailySummerySlice = createSlice({
    name: 'dailySummery',
    initialState: {
        dailySummeryData: {},
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDailySummery.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchDailySummery.fulfilled, (state, action) => {
                state.loading = false;
                state.dailySummeryData = action.payload
            })
            .addCase(fetchDailySummery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})



export default dailySummerySlice.reducer;
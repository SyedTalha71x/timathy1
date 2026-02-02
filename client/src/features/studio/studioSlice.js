import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as StudioApi from "./studioApi";

export const fetchMyStudio = createAsyncThunk('studio/myStudio', async (_, { rejectWithValue }) => {
    try {
        const res = await StudioApi.myStudio();
        return res.studio;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



const studioSlice = createSlice({
    name: 'studio',
    initialState: {
        studio: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyStudio.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyStudio.fulfilled, (state, action) => {
                state.loading = false;
                state.studio = action.payload;
            })
            .addCase(fetchMyStudio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }

})


export default studioSlice.reducer;
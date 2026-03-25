import * as websiteApi from './websiteApi'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


// ============
// get websites
// ============
export const fetchWebsiteThunk = createAsyncThunk('/website/fetch-website', async (_, { rejectWithValue }) => {
    try {
        const res = await websiteApi.getWebsite();
        return res.website
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ============
// create websites
// ============
export const createWebsiteThunk = createAsyncThunk('/website/create-website', async (data, { rejectWithValue }) => {
    try {
        const res = await websiteApi.createWebsite(data);
        return res.website
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ============
// update websites
// ============
export const updateWebsiteThunk = createAsyncThunk('/website/update-website', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await websiteApi.updateWebsite(id, updateData);
        return res.website
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// ============
// delete websites
// ============
export const deleteWebsiteThunk = createAsyncThunk('/website/delete-website', async (id, { rejectWithValue }) => {
    try {
        const res = await websiteApi.deleteWebsite(id);
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


const websiteSlice = createSlice({
    name: 'website',
    initialState: {
        website: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // -------
            // fetch website slice
            // ---------
            .addCase(fetchWebsiteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchWebsiteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.website = action.payload;
            })
            .addCase(fetchWebsiteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // -------
            // create website slice
            // ---------
            .addCase(createWebsiteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createWebsiteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.website = action.payload;
            })
            .addCase(createWebsiteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // -------
            // update website slice
            // ---------
            .addCase(updateWebsiteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateWebsiteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.website = action.payload;
            })
            .addCase(updateWebsiteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // -------
            // delete website slice
            // ---------
            .addCase(deleteWebsiteThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteWebsiteThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.website = action.payload;
            })
            .addCase(deleteWebsiteThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})



export default websiteSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as studioApi from "./studioApi";

export const fetchMyStudio = createAsyncThunk('studio/myStudio', async (_, { rejectWithValue }) => {
    try {
        const res = await studioApi.myStudio();
        return res.studio;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const fetchAllStudios = createAsyncThunk('/studio/all-studio', async (_, { rejectWithValue }) => {
    try {
        const res = await studioApi.getAllStudioApi()
        return res.studios
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// In your studioSlice.js or studioApi.js
export const updateStudioThunk = createAsyncThunk(
    'studio/update',
    async ({ studioId, data }, { rejectWithValue }) => {
        try {
            let formData;

            // If data is already FormData, use it
            if (data instanceof FormData) {
                formData = data;
            } else {
                // Convert plain object to FormData
                formData = new FormData();
                Object.keys(data).forEach(key => {
                    const value = data[key];

                    // Handle different value types
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'object') {
                            // For arrays/objects like openingHours, stringify them
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value.toString());
                        }
                    }
                });
            }

            // Always ensure studioId is included
            formData.append('studioId', studioId);

            const response = await studioApi.updateStudio(studioId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const studioSlice = createSlice({
    name: 'studio',
    initialState: {
        // studios: [],
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

            // getAll Studio
            .addCase(fetchAllStudios.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllStudios.fulfilled, (state, action) => {
                state.loading = false;
                state.studio = action.payload;
            })
            .addCase(fetchAllStudios.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateStudioThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudioThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.studio = action.payload;
            })
            .addCase(updateStudioThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }

})


export default studioSlice.reducer;
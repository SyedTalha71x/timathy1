import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as canvasApi from './canvasApi'

export const createMaterialThunk = createAsyncThunk('/material/create-material', async (data, { rejectWithValue }) => {
    try {
        const res = await canvasApi.createMaterialApi(data)
        return res.introduction
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const updateMaterialThunk = createAsyncThunk('/material/update-material', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await canvasApi.updateMaterialApi(id, updateData)
        return res.introduction
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteMaterialThunk = createAsyncThunk('/material/delete-material', async (id, { rejectWithValue }) => {
    try {
        const res = await canvasApi.deleteMaterialApi(id)
        return { id, message: res.message }  // Return both id and message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const fetchMaterialThunk = createAsyncThunk('/material/fetch-material', async (_, { rejectWithValue }) => {
    try {
        const res = await canvasApi.getAllMaterialApi()
        return res.materials
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const materialSlice = createSlice({
    name: 'material',
    initialState: {
        materials: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET ALL
            .addCase(fetchMaterialThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(fetchMaterialThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.materials = action.payload || [];  // Ensure it's always an array
                state.error = null
            })
            .addCase(fetchMaterialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch materials'
            })
            
            // CREATE
            .addCase(createMaterialThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createMaterialThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Add the new material to the existing array
                if (action.payload) {
                    state.materials = [...state.materials, action.payload];
                }
                state.error = null
            })
            .addCase(createMaterialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create material'
            })
            
            // UPDATE
            .addCase(updateMaterialThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateMaterialThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Replace the updated material in the array
                if (action.payload) {
                    const index = state.materials.findIndex(m => m._id === action.payload._id);
                    if (index !== -1) {
                        state.materials[index] = action.payload;
                    } else {
                        // If not found (shouldn't happen), add it
                        state.materials.push(action.payload);
                    }
                }
                state.error = null
            })
            .addCase(updateMaterialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update material'
            })

            // DELETE
            .addCase(deleteMaterialThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteMaterialThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted material from the array
                const deletedId = action.payload.id;
                state.materials = state.materials.filter(m => m._id !== deletedId);
                state.error = null
            })
            .addCase(deleteMaterialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete material'
            })
    }
})

export default materialSlice.reducer;
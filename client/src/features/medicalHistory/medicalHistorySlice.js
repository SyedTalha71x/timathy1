import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as medicalHistoryApi from './medicalHistoryApi'


export const createFormThunk = createAsyncThunk('/medical/create-form', async (mediData, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.createMedical(mediData)
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const getAllFormThunk = createAsyncThunk('/medical/all-forms', async (_, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.getAllForms();
        return res.forms
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// toggle form active and inactive

export const toggleActiveThunk = createAsyncThunk('/medical/toggle-active', async (id, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.toggleActive(id);
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// update Form
export const updateFormThunk = createAsyncThunk('/medical/update-form', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.updateForm(id, updateData);
        return res.form
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// delete form
export const deleteFormThunk = createAsyncThunk('/medical/delete-form', async (id, { rejectWithValue }) => {
    try {
        const res = await medicalHistoryApi.deleteForm(id);
        return res.message
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

const medicalSlice = createSlice({
    name: 'medical',
    initialState: {
        medical: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // create medical Forms
            .addCase(createFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(createFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // All medical Forms
            .addCase(getAllFormThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAllFormThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(getAllFormThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // Toggle medical Forms
            .addCase(toggleActiveThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(toggleActiveThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.medical = action.payload
            })
            .addCase(toggleActiveThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export default medicalSlice.reducer
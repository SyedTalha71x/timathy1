import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as medicalHistoryApi from './medicalHistoryApi'


export const createFormThunk = createAsyncThunk('/medical/create-form', async (mediData, { rejectWithValue }) => {
    try {
        await medicalHistoryApi.createMedical(mediData)
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const getAllFormThunk = createAsyncThunk('/medical/all-forms', async (_, { rejectWithValue }) => {
    try {
        await medicalHistoryApi.getAllForms();
    } catch (error) {
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
    }
})

export default medicalSlice.reducer
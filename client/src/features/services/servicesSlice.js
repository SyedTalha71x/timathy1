import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as ServiceApi from './servicesApi'

// all services / appointment Types
export const fetchStudioServices = createAsyncThunk('studio/studioServices', async (_, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.studioServices()
        return res.services
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// create Appointment Types

export const createAppointmentTypesThunk = createAsyncThunk('/studio/services/create', async (data, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.createAppointmentTypes(data);
        return res.service
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// update Appointment Types

export const updateAppointmentTypesThunk = createAsyncThunk('/studio/services/update', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.updateAppointmentTypes(id, updateData);
        return res.service
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// delete Appointment Types

export const deleteAppointmentTypesThunk = createAsyncThunk('/studio/services/delete', async (id, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.deleteAppointmentTypes(id);
        return res
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        services: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get services
            .addCase(fetchStudioServices.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchStudioServices.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(fetchStudioServices.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            // create appointment Type Slice
            .addCase(createAppointmentTypesThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(createAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            // update appointmentTypes Slice
            .addCase(updateAppointmentTypesThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(updateAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            // delete AppointmentType Slice
            .addCase(deleteAppointmentTypesThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(deleteAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })
    }
})

export default serviceSlice.reducer
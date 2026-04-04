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

export const createServiceThunk = createAsyncThunk('/studio/services/create', async (data, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.createServiceApi(data);
        return res.service
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// update Appointment Types

export const updateServiceThunk = createAsyncThunk('/studio/services/update', async ({ serviceId, updateData }, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.updateServiceApi(serviceId, updateData);
        return res.service
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
// delete Appointment Types

export const deleteServiceThunk = createAsyncThunk('/studio/services/delete', async (serviceId, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.deleteServiceApi(serviceId);
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
            .addCase(createServiceThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createServiceThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(createServiceThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            // update Service Slice
            .addCase(updateServiceThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(updateServiceThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(updateServiceThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            // delete AppointmentType Slice
            .addCase(deleteServiceThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(deleteServiceThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(deleteServiceThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })

            
    }
})

export default serviceSlice.reducer
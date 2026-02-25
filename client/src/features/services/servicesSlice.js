import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as ServiceApi from './servicesApi'


export const fetchstudioServices = createAsyncThunk('studio/studioServices', async (_, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.studioServices()
        return res.services
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
            .addCase(fetchstudioServices.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchstudioServices.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(fetchstudioServices.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })
    }
})

export default serviceSlice.reducer
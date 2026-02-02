import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as ServiceApi from './servicesApi'


export const fetchMyServices = createAsyncThunk('studio/myServices', async (_, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.myServices()
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
            .addCase(fetchMyServices.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchMyServices.fulfilled, (state, action) => {
                state.loading = false,
                    state.services = action.payload;
            })
            .addCase(fetchMyServices.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload?.error
            })
    }
})

export default serviceSlice.reducer
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
// &&&&&&&&&&&&&&
//  ALL APPOINTMENT CATEGORIES THUNKS
// &&&&&&&&&&&&&&&&&&&

// &&& Create  Appointment Category &&&
export const createAppointmentCategoryThunk = createAsyncThunk('/appointment/category/create-category', async (data, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.createCategoryApi(data)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& Get  Appointment Categories &&&
export const getAppointmentCategoriesThunk = createAsyncThunk('/appointment/category/get-appointment-categories', async (_, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.getCategoryApi();
        return res.categories
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& update Appointment Category &&&
export const updateAppointmentCategoryThunk = createAsyncThunk('/appointment/category/update-category', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.updateCategoryApi(id, updateData)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& delete Appointment Category &&&
export const deleteAppointmentCategoryThunk = createAsyncThunk('/appointment/category/delete-category', async (id, { rejectWithValue }) => {
    try {
        const res = await ServiceApi.deleteCategoryApi(id)
        return { id, message: res.message }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})



const serviceSlice = createSlice({
    name: 'services',
    initialState: {
        services: [],
        appointmentCategories: [],
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

            // &&&&&&&&&&
            // ALL CATEGORIES SLICES
            // &&&&&&&&&&&&&&&

            // get categories
            .addCase(getAppointmentCategoriesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAppointmentCategoriesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentCategories = action.payload
            })
            .addCase(getAppointmentCategoriesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // create category
            .addCase(createAppointmentCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createAppointmentCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentCategories = [...state.appointmentCategories, action.payload];
            })
            .addCase(createAppointmentCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // update category
            .addCase(updateAppointmentCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateAppointmentCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentCategories = state.appointmentCategories.map(cat =>
                    cat._id === action.payload._id ? action.payload : cat
                );
            })
            .addCase(updateAppointmentCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // delete category
            .addCase(deleteAppointmentCategoryThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteAppointmentCategoryThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentCategories = state.appointmentCategories.filter(cat => cat._id !== action.payload.id);
            })
            .addCase(deleteAppointmentCategoryThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})

export default serviceSlice.reducer
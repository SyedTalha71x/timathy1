import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as AppointmentsApi from './AppointmentApi'


export const fetchMyAppointments = createAsyncThunk('appointment/myAppointments', async (_, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.myAppointments()
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


export const createMyAppointment = createAsyncThunk('appointment/createAppointment', async (appointmentData, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.createAppointment(appointmentData)
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const createBlockAppointmentThunk = createAsyncThunk('appointment/block', async (blockAppointment, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.createBlockAppointment(blockAppointment);
        return res.appointments;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


export const cancelAppointment = createAsyncThunk('appointment/cancel', async (appointmentId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.canceledAppointment(appointmentId)
        return res.appointment;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})


// fetch all appointments

export const fetchAllAppointments = createAsyncThunk('appointments/all', async (_, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.allAppointments();
        return res.appointments
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
})


// fetch appointment by member id

export const fetchAppointmentByMemberId = createAsyncThunk('appointments/member', async (memberId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.appointmentByMemberId(memberId);
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
})


// create appointment by staff for member
export const createdAppointmentByStaff = createAsyncThunk('appointments/createByStaff', async ({ memberId, appointmentData }, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.createAppointmentByStaff(memberId, appointmentData);
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
})

// book Trial for Staff
export const createBookingTrialThunk = createAsyncThunk('appointments/createByStaff/trial', async ({ leadId, trialData }, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.createBookingTrialByStaff(leadId, trialData);
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
})



// Update Appointment Thunk
export const updateAppointmentThunk = createAsyncThunk('appointment/update', async ({ appointmentId, updateData }, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.updateAppointment(appointmentId, updateData)
        return res.appointment
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


// delete Appointment Thunk

export const deleteAppointmentThunk = createAsyncThunk("appointment/delete", async (appointmentId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.deleteAppointment(appointmentId);
        return res.data
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})




// get all pending appointments 

export const fetchAllPendingAppointmentThunk = createAsyncThunk('/appointment/pendings', async (_, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.getAllPendingAppointmentsApi()
        return res.appointments
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const approvedAppointmentThunk = createAsyncThunk('/appointment/approved-appointment', async (appointmentId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.approvedAppointmentApi(appointmentId)
        return res.appointment
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const rejectedAppointmentThunk = createAsyncThunk('/appointment/rejected-appointment', async (appointmentId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.rejectedAppointmentApi(appointmentId)
        return res.appointment
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
        const res = await AppointmentsApi.createCategoryApi(data)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& Get  Appointment Categories &&&
export const getAppointmentCategoriesThunk = createAsyncThunk('/appointment/category/get-appointment-categories', async (_, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.getCategoryApi();
        return res.categories
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& update Appointment Category &&&
export const updateAppointmentCategoryThunk = createAsyncThunk('/appointment/category/update-category', async ({ id, updateData }, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.updateCategoryApi(id, updateData)
        return res.category
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

// &&& delete Appointment Category &&&
export const deleteAppointmentCategoryThunk = createAsyncThunk('/appointment/category/delete-category', async (id, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.deleteCategoryApi(id)
        return { id, message: res.message }
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


export const createAppointmentTypesThunk = createAsyncThunk('/appointment/types/create', async (data, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.createAppointmentTypesApi(data)
        return res.type
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const updateAppointmentTypesThunk = createAsyncThunk('/appointment/types/update-type', async ({ typeId, updateData }, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.updateAppointmentTypesApi(typeId, updateData)
        return res.type
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const deleteAppointmentTypesThunk = createAsyncThunk('/appointment/type/delete-type', async (typeId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.deleteAppointmentTypesApi(typeId)
        return res.type
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})
export const getAppointmentTypesThunk = createAsyncThunk('/appointment/types', async (_, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.getAppointmentTypesApi()
        return res.types
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointmentsByMember: {},
        appointments: [],
        appointmentCategories: [],
        appointmentTypes: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyAppointments.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.loading = false,
                    state.appointments = action.payload
            })
            .addCase(fetchMyAppointments.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
            // fetch pending appointments
            .addCase(fetchAllPendingAppointmentThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(fetchAllPendingAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.appointments = action.payload
            })
            .addCase(fetchAllPendingAppointmentThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })

            // createAppointment 
            .addCase(createMyAppointment.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(createMyAppointment.fulfilled, (state, action) => {
                state.loading = false,
                    state.appointments = action.payload
            })
            .addCase(createMyAppointment.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
            // canceled Appointment 
            .addCase(cancelAppointment.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.loading = false;

                const updatedAppointment = action.payload;

                state.appointments = state.appointments.map((appt) =>
                    appt._id === updatedAppointment._id ? updatedAppointment : appt
                );
            })

            .addCase(cancelAppointment.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })


            // all apointments
            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // appointment by member id
            .addCase(fetchAppointmentByMemberId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAppointmentByMemberId.fulfilled, (state, action) => {
                state.loading = false;
                const memberId = action.meta.arg;       // the member ID you dispatched with
                state.appointmentsByMember[memberId] = action.payload;  // store per member
            })
            .addCase(fetchAppointmentByMemberId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // create appointment by staff for member
            .addCase(createdAppointmentByStaff.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createdAppointmentByStaff.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally, you can add the newly created appointment to the list
                state.appointments.push(action.payload);
            })
            .addCase(createdAppointmentByStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // createBookingTrialThunk
            .addCase(createBookingTrialThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBookingTrialThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally, you can add the newly created appointment to the list
                state.appointments.push(action.payload);
            })
            .addCase(createBookingTrialThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // block Appointment Slot
            .addCase(createBlockAppointmentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBlockAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally, you can add the newly created appointment to the list
                state.appointments.push(action.payload);
            })
            .addCase(createBlockAppointmentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // update Appointment
            .addCase(updateAppointmentThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false;
                const update = action.payload
                state.appointments = state.appointments.map((appt) =>
                    appt._id === update._id ? update : appt
                );
            })
            .addCase(updateAppointmentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            // update Appointment
            .addCase(deleteAppointmentThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false;
                const update = action.payload
                state.appointments = state.appointments.map((appt) =>
                    appt._id === update._id ? update : appt
                );
            })
            .addCase(deleteAppointmentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // approved Slice
            .addCase(approvedAppointmentThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(approvedAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.appointments = action.payload
            })
            .addCase(approvedAppointmentThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
            // rejected Slice
            .addCase(rejectedAppointmentThunk.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(rejectedAppointmentThunk.fulfilled, (state, action) => {
                state.loading = false,
                    state.appointments = action.payload
            })
            .addCase(rejectedAppointmentThunk.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
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
            // &&&&&&&&&&
            // ALL Appointment Types SLICES
            // &&&&&&&&&&&&&&&

            // get categories
            .addCase(getAppointmentTypesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(getAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentTypes = action.payload
            })
            .addCase(getAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // create category
            .addCase(createAppointmentTypesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentTypes = [...state.appointmentTypes, action.payload];
            })
            .addCase(createAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // update category
            .addCase(updateAppointmentTypesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(updateAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentTypes = state.appointmentTypes.map(cat =>
                    cat._id === action.payload._id ? action.payload : cat
                );
            })
            .addCase(updateAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

            // delete category
            .addCase(deleteAppointmentTypesThunk.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(deleteAppointmentTypesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.appointmentTypes = state.appointmentTypes.filter(cat => cat._id !== action.payload.id);
            })
            .addCase(deleteAppointmentTypesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })

    }
})

export default appointmentSlice.reducer
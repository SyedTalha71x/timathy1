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

export const cancelAppointment = createAsyncThunk('appointment/cancel', async (appointmentId, { rejectWithValue }) => {
    try {
        const res = await AppointmentsApi.canceledAppointment(appointmentId)
        return res.appointment;
    }
    catch (error) {
        return rejectWithValue(error.response?.data?.message)
    }
})


const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointments: [],
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
    }
})

export default appointmentSlice.reducer
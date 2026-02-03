import { configureStore } from '@reduxjs/toolkit';
// import memberReducer from '../features/member/memberSlice';
import authReducer from '../features/auth/authSlice';
import studioReducer from '../features/studio/studioSlice';
import servicesReducers from '../features/services/servicesSlice';
import appointmentReducers from '../features/appointments/AppointmentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // members: memberReducer,
        studios: studioReducer,
        services: servicesReducers,
        appointments: appointmentReducers
    }
})
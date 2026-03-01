import { configureStore } from '@reduxjs/toolkit';
import memberReducer from '../features/member/memberSlice';
import authReducer from '../features/auth/authSlice';
import studioReducer from '../features/studio/studioSlice';
import servicesReducers from '../features/services/servicesSlice';
import appointmentReducers from '../features/appointments/AppointmentSlice'
import trainingReducers from '../features/training/TrainingSlice';
import barCodeReducers from '../features/barcodeScanner/barCodeSlice';
import foodReducers from '../features/food/foodSlice'
import userGoalReducers from '../features/userGoals/userGoalSlice'
import dailySummeryReducers from '../features/dailysummery/dailySummerySlice';
import reminderReducers from '../features/notification/notificationSlice'
import chatReducers from '../features/communication/chatSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        member: memberReducer,
        studios: studioReducer,
        services: servicesReducers,
        appointments: appointmentReducers,
        trainings: trainingReducers,
        barCode: barCodeReducers,
        food: foodReducers,
        goal: userGoalReducers,
        dailySummery: dailySummeryReducers,
        reminder: reminderReducers,
        chats: chatReducers
    }
})
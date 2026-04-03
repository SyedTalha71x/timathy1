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
import relationReducer from '../features/relation/relationSlice';
import leadReducer from '../features/lead/leadSlice';
import specialNotesReducer from '../features/specialNotes/specialNoteSlice'
import staffReducer from '../features/staff/staffSlice'
import taskReducer from '../features/todos/todosSlice'
import noteReducer from '../features/notes/noteSlice'
import medicalReducer from '../features/medicalHistory/medicalHistorySlice'
import websiteReducer from '../features/website/websiteSlice'
import supportReducer from '../features/supportCenter/supportSlice'

import classReducers from '../features/classes/classSlice'
import postReducers from '../features/bulletinBoard/bulletinSlice'
import contractReducers from '../features/contract/contractSlice'



export const store = configureStore({
    reducer: {
        auth: authReducer,
        member: memberReducer,
        staff: staffReducer,
        studios: studioReducer,
        services: servicesReducers,
        appointments: appointmentReducers,
        trainings: trainingReducers,
        barCode: barCodeReducers,
        food: foodReducers,
        goal: userGoalReducers,
        dailySummery: dailySummeryReducers,
        reminder: reminderReducers,
        chats: chatReducers,
        relation: relationReducer,
        leads: leadReducer,
        specials: specialNotesReducer,
        todos: taskReducer,
        notes: noteReducer,
        medical: medicalReducer,
        website: websiteReducer,
        support: supportReducer,
        classes: classReducers,
        posts: postReducers,
        contracts: contractReducers
    }
})
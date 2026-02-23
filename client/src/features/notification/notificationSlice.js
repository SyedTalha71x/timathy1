import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as notificationApi from './notificationApi';

// --- Appointment Reminders ---
export const fetchMyReminder = createAsyncThunk(
  'reminder/fetchMyReminder',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.myReminder();
      return res.reminder;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateReminders = createAsyncThunk(
  'reminder/updateReminders',
  async ({ appointmentId, reminderData }, { rejectWithValue }) => {
    try {
      const res = await notificationApi.updateReminder(appointmentId, reminderData);
      return res.reminder;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- Nutrition Reminders ---
export const fetchMyNutritionReminder = createAsyncThunk(
  'reminder/fetchMyNutritionReminder',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.nutritionNotification();
      return res.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateNutritionData = createAsyncThunk(
  'reminder/updateNutritionData',
  async (updates, { rejectWithValue }) => {
    try {
      const res = await notificationApi.updateNutritionNotification(updates);
      return res.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// --- Slice ---
const reminderSlice = createSlice({
  name: 'reminder',
  initialState: {
    appointmentReminders: null,
    nutritionReminders: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Appointment
      .addCase(fetchMyReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentReminders = action.payload;
      })
      .addCase(fetchMyReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Appointment
      .addCase(updateReminders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentReminders = action.payload;
      })
      .addCase(updateReminders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Nutrition
      .addCase(fetchMyNutritionReminder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyNutritionReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritionReminders = action.payload;
      })
      .addCase(fetchMyNutritionReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Nutrition
      .addCase(updateNutritionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNutritionData.fulfilled, (state, action) => {
        state.loading = false;
        state.nutritionReminders = action.payload;
      })
      .addCase(updateNutritionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reminderSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as trainingApi from './TrainingApi';


export const fetchTrainingVideos = createAsyncThunk(
    'training/fetchTrainingVideos',
    async (_, { rejectWithValue }) => {
        try {
            const data = await trainingApi.getAllMyTrainings();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchMyPlans = createAsyncThunk(
    'training/fetchMyPlans',
    async (_, { rejectWithValue }) => {
        try {
            const data = await trainingApi.getMyTrainingPlans();
            return data.plans || [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)




const trainingSlice = createSlice({
    name: 'training',
    initialState: {
        trainings: [],
        myPlans: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrainingVideos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingVideos.fulfilled, (state, action) => {
                state.loading = false;
                state.trainings = action.payload;
            })
            .addCase(fetchTrainingVideos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchMyPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.myPlans = action.payload;
            })
            .addCase(fetchMyPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
})
export default trainingSlice.reducer;
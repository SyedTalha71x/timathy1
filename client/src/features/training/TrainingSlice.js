import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as trainingApi from './TrainingApi';

// ===== all Training Video related thunks =====


// *** Fetch Videos for Training Video Center ***
export const fetchTrainingVideos = createAsyncThunk(
    'training/fetchTrainingVideos',
    async (_, { rejectWithValue }) => {
        try {
            const data = await trainingApi.getAllMyTrainings();
            return data.videos || [];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

// *** Upload Video to Training Video Center ***
export const uploadTrainingVideo = createAsyncThunk('training/uploadTrainingVideo', async (videoData, { rejectWithValue }) => {
    try {
        const data = await trainingApi.uploadVideo(videoData);
        return data.video || {};
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// === all my Training Plans related thunks ===


// **** fetch MyPlans || logged in user plans ***
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

// *** create Training Plan ***
export const createPlan = createAsyncThunk('training/createTrainingPlan', async (planData, { rejectWithValue }) => {
    try {
        const data = await trainingApi.createTrainingPlan(planData);
        return data.plan || {};
    } catch (error) {
        return rejectWithValue(error.message);
    }
});




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
            // === all training videos ===
            // *** Fetching Videos ***
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
            // *** Uploading Video ***
            .addCase(uploadTrainingVideo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadTrainingVideo.fulfilled, (state, action) => {
                state.loading = false;
                state.trainings.push(action.payload)
            })
            .addCase(uploadTrainingVideo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message
            })

            // === all Plan reducers ===

            // *** fetch My Plans ***
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
            // *** create Plans ***
            .addCase(createPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.myPlans.push(action.payload);
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error?.message
            })
    }
})
export default trainingSlice.reducer;
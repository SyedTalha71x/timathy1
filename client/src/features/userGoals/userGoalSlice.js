import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userGoalApi from './userGoalApi';


export const createGoals = createAsyncThunk('/goal/create-goals', async (goalData, { rejectWithValue }) => {
    try {
        const res = await userGoalApi.createGoal(goalData);
        return res.goal;
    } catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


const userGoalSlice = createSlice({
    name: 'userGoal',
    initialState: {
        goals: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createGoals.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createGoals.fulfilled, (state,action) => {
                state.loading = false;
                state.goals = action.payload;
                state.error = null
            })
            .addCase(createGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
    }
})

export default userGoalSlice.reducer;
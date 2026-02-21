import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as foodApi from './foodApi'


export const fetchFood = createAsyncThunk('/fetch/food', async (_, { rejectWithValue }) => {
    try {
        const res = await foodApi.getFood();
        return res.food;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})

export const newFood = createAsyncThunk('/create/food', async (newFoodData, { rejectWithValue }) => {
    try {
        const res = await foodApi.createFood(newFoodData);
        return res.dailyLog;
    }
    catch (error) {
        return rejectWithValue(error.response?.data);
    }
});




const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foodData: [],
        dailyLogsData:[],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFood.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFood.fulfilled, (state, action) => {
                state.loading = false,
                    state.foodData = action.payload;
            })
            .addCase(fetchFood.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
            .addCase(newFood.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(newFood.fulfilled, (state, action) => {
                state.loading = false;
                state.dailyLogsData = action.payload
            })
            .addCase(newFood.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message
            })
    }
})



export default foodSlice.reducer;
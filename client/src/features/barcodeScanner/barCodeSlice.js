import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as barCodeApi from './barCodeApi'


export const barcodeScanner = createAsyncThunk('/food/barcode', async (code, { rejectWithValue }) => {
    try {
        const res = await barCodeApi.foodByBarcode(code)
        const food = res.food || res
        if (!food || !food.name) {
            return rejectWithValue({ message: "Product not recognized as a food item." })
        }
        return food
    }
    catch (error) {
        return rejectWithValue(error.response?.data || { message: "Failed to look up barcode. Please try again." })
    }
})


const barcodeSlice = createSlice({
    name: 'barcode',
    initialState: {
        scanning: false,
        foodData: null,
        error: null
    },
    reducers: {
        startScan: (state) => {
            state.scanning = true;
            state.foodData = null;
            state.error = null
        },
        resetScan: (state) => {
            state.scanning = false;
            state.foodData = null;
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(barcodeScanner.pending, (state) => {
                state.scanning = true;
                state.foodData = null;
                state.error = null;
            })
            .addCase(barcodeScanner.fulfilled, (state, action) => {
                state.scanning = false;
                state.foodData = action.payload;
                state.error = null
            })
            .addCase(barcodeScanner.rejected, (state, action) => {
                state.scanning = false;
                state.foodData = null;
                state.error = action.payload?.message || "Product not found. Try scanning again or search manually."
            });
    },
});

export const { startScan, resetScan } = barcodeSlice.actions;

export default barcodeSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as classApi from './classApi'


// &&&&&&&&&&&&&&
//  ALL CATEGORIES THUNKS
// &&&&&&&&&&&&&&&&&&&


// **************
// ALL CLASS-TYPES THUNK
// ********************



// %%%%%%%%%%%%%%
// ALL CLASSES THUNKS
// %%%%%%%%%%%%%%%%%%



const classSlice = createSlice({
    name: 'classes',
    initialState: {
        classes: [],
        categories: [],
        classTypes: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

// &&&&&&&&&&
// ALL CATEGORIES SLICES
// &&&&&&&&&&&&&&&

            // get categories
            // .addCase()
            // create category
            // .addCase()



            // ******************
            // ALL CLASS-TYPES SLICES
            // ***********************


            // %%%%%%%%%%%%%
            // ALL CLASS SLICES
            // %%%%%%%%%%%%%%%%%%%
    }
})



export default classSlice.reducer

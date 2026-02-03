// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import * as memberApi from "./memberApi";


// // loginMember



// // create Member
// export const memberCreate = createAsyncThunk('member/create', async (memberData, { rejectWithValue }) => {
//     try {
//         await memberApi.registerMember(memberData)
//     }
//     catch (error) {
//         return rejectWithValue(error.response?.data)
//     }
// })














// const memberSlice = createSlice({

//     name: 'member',
//     initialState: {
//         member: null,
//         token: null,
//         loading: false,
//         error: null
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
       

//     }
// })


// export default memberSlice.reducer;
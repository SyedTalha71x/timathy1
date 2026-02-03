import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as memberApi from "./memberApi";


// loginMember
export const memberLogin = createAsyncThunk('member/login', async (credentials, { rejectWithValue }) => {
    try {
        const data = await memberApi.loginMember(credentials);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});


// create Member
export const memberCreate = createAsyncThunk('member/create', async (memberData, { rejectWithValue }) => {
    try {
        await memberApi.registerMember(memberData)
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})


export const updateMemberData = createAsyncThunk('/member/update', async (updateData, { rejectWithValue }) => {
    try {
        const res = await memberApi.updateMember(updateData)
        return res.data;
    }
    catch (error) {
        return rejectWithValue(error.response?.data)
    }
})











const memberSlice = createSlice({

    name: 'member',
    initialState: {
        member: null,
        token: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(memberLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(memberLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.member = action.payload.member;
                state.token = action.payload.token;
            })
            .addCase(memberLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })
            .addCase(updateMemberData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberData.fulfilled, (state, action) => {
                state.loading = false;
                state.member = action.payload.member;
            })
            .addCase(updateMemberData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.error;
            })

    }
})


export default memberSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from './authApi';

export const memberLogin = createAsyncThunk('member/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.loginMember(credentials);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.logoutUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const me = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.user;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const updateMemberData = createAsyncThunk('/member/update', async (updateData, { rejectWithValue }) => {
  try {
    const res = await authApi.updateMember(updateData)
    return res.data;
  }
  catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ME
      .addCase(me.pending, (state) => {
        state.loading = true;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      })
      .addCase(memberLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(memberLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
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
        state.user = {
          ...state.user,    // keep existing fields
          ...action.payload.user  // overwrite only updated fields
        };
        state.error = null;
      })

      .addCase(updateMemberData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })

  }
});

export default authSlice.reducer;

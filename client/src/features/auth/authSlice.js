import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from './authApi';

export const memberLogin = createAsyncThunk(
  'member/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.loginMember(credentials);
      return data; // expect { member: {...}, token: '...' } or { message: 'Rejected' }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.logoutUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout failed' });
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
      return rejectWithValue(error.response?.data || { message: 'Fetch user failed' });
    }
  }
);

export const updateMemberData = createAsyncThunk(
  '/member/update',
  async (updateData, { rejectWithValue }) => {
    try {
      const res = await authApi.updateMember(updateData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ME
      .addCase(me.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || 'Failed to fetch user';
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
      })

      // MEMBER LOGIN
      .addCase(memberLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(memberLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.isAuthenticated =!!action.payload.user;
        state.error = null;
      })
      .addCase(memberLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // UPDATE MEMBER DATA
      .addCase(updateMemberData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...state.user,
<<<<<<< HEAD
          ...action.payload.user,
=======
          ...(action.payload.user || {}),
>>>>>>> e334f5f86db13d986d73e142532cb7da712fd58e
        };
        state.error = null;
      })
      .addCase(updateMemberData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Update failed';
      });
  },
});

export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from './authApi';



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
      });

  }
});

export default authSlice.reducer;

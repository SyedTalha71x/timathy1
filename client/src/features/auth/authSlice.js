import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from './authApi';

// member Login
export const memberLogin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.loginMember(credentials);
      return data; // expect { member: {...}, token: '...' } or { message: 'Rejected' }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Login failed' });
    }
  }
);

// Logout
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
// all data related to login member which easy to stay login after refresh
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

// member update data like email name phone number
export const updateUserData = createAsyncThunk(
  'auth/update',
  async (updateData, { rejectWithValue }) => {
    try {
      const res = await authApi.updateMember(updateData);
      return res.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Update failed' });
    }
  }
);


//  changed password request

export const updatedPassword = createAsyncThunk('/auth/change-password', async (updatePassword, { rejectWithValue }) => {
  try {
    const res = await authApi.changedPassword(updatePassword)
    return res
  }
  catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

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
        state.isAuthenticated = !!action.payload.user;
        state.error = null;
      })
      .addCase(memberLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // UPDATE MEMBER DATA
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;

        // Merge safely into existing user object
        if (action.payload) {
          state.user = { ...state.user, ...(action.payload.user || action.payload) };
          state.isAuthenticated = !!state.user;
        }

        state.error = null;
      })

      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Update failed';
      })

      // update password
      .addCase(updatedPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updatedPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message
      })
  },
});

export default authSlice.reducer;

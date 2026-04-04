import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from './authApi';

// ==============================================
// Member Apis Thunks
// ==============================================
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

// ==============================================
// Other Auth Apis Thunks
// ==============================================
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

// changed password request
export const updatedPassword = createAsyncThunk('/auth/change-password', async (updatePassword, { rejectWithValue }) => {
  try {
    const res = await authApi.changedPassword(updatePassword)
    return res
  }
  catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

// ==============================================
// Staff Apis Thunks
// ==============================================
export const staffLoginThunk = createAsyncThunk('/auth/staff/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authApi.StaffLogin(credentials);
    return res.user
  } catch (error) {
    return rejectWithValue(error.response?.data)
  }
})

// ==============================================
// Roles & Permissions Thunks (using authApi)
// ==============================================

// ==============================================
// Roles & Permissions Thunks - NO studioId
// ==============================================

// Get all roles
export const getAllRolesThunk = createAsyncThunk(
  'auth/getAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getAllRolesApi()
      return res.roles || res.data || []
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Create role
export const createRoleThunk = createAsyncThunk(
  'auth/createRole',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.createRoleApi(data)
      return res.role
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Get role by ID
export const getRoleByIdThunk = createAsyncThunk(
  'auth/getRoleById',
  async (roleId, { rejectWithValue }) => {
    try {
      const res = await authApi.getRoleByIdApi(roleId)
      return res.role
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Update role
export const updateRoleThunk = createAsyncThunk(
  'auth/updateRole',
  async ({ roleId, updateData }, { rejectWithValue }) => {
    try {
      const res = await authApi.updateRoleApi(roleId, updateData)
      return res.role
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Delete role
export const deleteRoleThunk = createAsyncThunk(
  'auth/deleteRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const res = await authApi.deleteRoleApi(roleId)
      return { roleId, message: res.message }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Assign staff to role
export const assignStaffToRoleThunk = createAsyncThunk(
  'auth/assignStaffToRole',
  async ({ roleId, staffIds }, { rejectWithValue }) => {
    try {
      const res = await authApi.assignStaffToRoleApi(roleId, staffIds)
      return res.role
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Remove staff from role
export const removeStaffFromRoleThunk = createAsyncThunk(
  'auth/removeStaffFromRole',
  async ({ roleId, staffId }, { rejectWithValue }) => {
    try {
      const res = await authApi.removeStaffFromRoleApi(roleId, staffId)
      return { roleId, staffId, message: res.message }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Get staff by role
export const getStaffByRoleThunk = createAsyncThunk(
  'auth/getStaffByRole',
  async (roleId, { rejectWithValue }) => {
    try {
      const res = await authApi.getStaffByRoleApi(roleId)
      return { roleId, staff: res.staff }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// ==============
// Permission Thunks
// ++++++++++++++++++++
// ==============================================
// Permission Thunks - ALL 4
// ==============================================

// 1. Get role permissions
export const getRolePermissionsThunk = createAsyncThunk(
  'auth/getRolePermissions',
  async (roleId, { rejectWithValue }) => {
    try {
      const res = await authApi.getRolePermissionsApi(roleId)
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// 2. Update role permissions
export const updateRolePermissionsThunk = createAsyncThunk(
  'auth/updateRolePermissions',
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      const res = await authApi.updateRolePermissionsApi(roleId, permissions)
      return res.role
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// 3. Check if staff has permission
export const checkStaffPermissionThunk = createAsyncThunk(
  'auth/checkStaffPermission',
  async ({ staffId, permission }, { rejectWithValue }) => {
    try {
      const res = await authApi.checkStaffPermissionApi(staffId, permission)
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// 4. Get current user's permissions
export const getMyPermissionsThunk = createAsyncThunk(
  'auth/getMyPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMyPermissionsApi()
      return res
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)



// ==============================================
// Initial State
// ==============================================
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  // Roles state
  roles: [],
  selectedRole: null,
  roleStaff: [],
  rolesLoading: false,
  rolesError: null,
  // Add these for permissions
  selectedRolePermissions: [],
  selectedRoleIsAdmin: false,
  checkingPermission: false,
  permissionCheck: null,
  userPermissions: [],
  userRoleName: null,
  isAdminUser: false
}

// ==============================================
// Auth Slice
// ==============================================
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null
    },
    clearRolesError: (state) => {
      state.rolesError = null
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null
      state.roleStaff = []
    },
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ==============================================
      // ME
      // ==============================================
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

      // ==============================================
      // LOGOUT
      // ==============================================
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
        state.roles = [];
        state.selectedRole = null;
        state.roleStaff = [];
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
      })

      // ==============================================
      // MEMBER LOGIN
      // ==============================================
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

      // ==============================================
      // UPDATE MEMBER DATA
      // ==============================================
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
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

      // ==============================================
      // UPDATE PASSWORD
      // ==============================================
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

      // ==============================================
      // STAFF LOGIN
      // ==============================================
      .addCase(staffLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(staffLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message
      })

      // ==============================================
      // GET ALL ROLES
      // ==============================================
      .addCase(getAllRolesThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(getAllRolesThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = action.payload;
        state.rolesError = null;
      })
      .addCase(getAllRolesThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to fetch roles';
      })

      // ==============================================
      // GET ROLE BY ID
      // ==============================================
      .addCase(getRoleByIdThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(getRoleByIdThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.selectedRole = action.payload;
        state.rolesError = null;
      })
      .addCase(getRoleByIdThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to fetch role';
      })

      // ==============================================
      // CREATE ROLE
      // ==============================================
      .addCase(createRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles.push(action.payload);
        state.rolesError = null;
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to create role';
      })

      // ==============================================
      // UPDATE ROLE
      // ==============================================
      .addCase(updateRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(updateRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?._id === action.payload._id) {
          state.selectedRole = action.payload;
        }
        state.rolesError = null;
      })
      .addCase(updateRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to update role';
      })

      // ==============================================
      // DELETE ROLE
      // ==============================================
      .addCase(deleteRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(deleteRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roles = state.roles.filter(role => role._id !== action.payload.roleId);
        if (state.selectedRole?._id === action.payload.roleId) {
          state.selectedRole = null;
        }
        state.rolesError = null;
      })
      .addCase(deleteRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to delete role';
      })

      // ==============================================
      // ASSIGN STAFF TO ROLE
      // ==============================================
      .addCase(assignStaffToRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(assignStaffToRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?._id === action.payload._id) {
          state.selectedRole = action.payload;
          state.roleStaff = action.payload.assignedStaff || [];
        }
        state.rolesError = null;
      })
      .addCase(assignStaffToRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to assign staff';
      })

      // ==============================================
      // REMOVE STAFF FROM ROLE
      // ==============================================
      .addCase(removeStaffFromRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(removeStaffFromRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        const roleIndex = state.roles.findIndex(role => role._id === action.payload.roleId);
        if (roleIndex !== -1) {
          state.roles[roleIndex].assignedStaff = state.roles[roleIndex].assignedStaff?.filter(
            staff => staff._id !== action.payload.staffId && staff !== action.payload.staffId
          ) || [];
        }
        if (state.selectedRole?._id === action.payload.roleId) {
          state.selectedRole.assignedStaff = state.selectedRole.assignedStaff?.filter(
            staff => staff._id !== action.payload.staffId && staff !== action.payload.staffId
          ) || [];
          state.roleStaff = state.selectedRole.assignedStaff || [];
        }
        state.rolesError = null;
      })
      .addCase(removeStaffFromRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to remove staff';
      })

      // ==============================================
      // GET STAFF BY ROLE
      // ==============================================
      .addCase(getStaffByRoleThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(getStaffByRoleThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.roleStaff = action.payload.staff;
        state.rolesError = null;
      })
      .addCase(getStaffByRoleThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to fetch staff';
      })

      // Add these after your existing cases in extraReducers

      // ==============================================
      // GET ROLE PERMISSIONS
      // ==============================================
      .addCase(getRolePermissionsThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(getRolePermissionsThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.selectedRolePermissions = action.payload.permissions;
        state.selectedRoleIsAdmin = action.payload.isAdmin;
        state.rolesError = null;
      })
      .addCase(getRolePermissionsThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to fetch permissions';
      })

      // ==============================================
      // UPDATE ROLE PERMISSIONS
      // ==============================================
      .addCase(updateRolePermissionsThunk.pending, (state) => {
        state.rolesLoading = true;
        state.rolesError = null;
      })
      .addCase(updateRolePermissionsThunk.fulfilled, (state, action) => {
        state.rolesLoading = false;
        const index = state.roles.findIndex(role => role._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        if (state.selectedRole?._id === action.payload._id) {
          state.selectedRole = action.payload;
        }
        state.rolesError = null;
      })
      .addCase(updateRolePermissionsThunk.rejected, (state, action) => {
        state.rolesLoading = false;
        state.rolesError = action.payload?.message || 'Failed to update permissions';
      })

      // ==============================================
      // CHECK STAFF PERMISSION
      // ==============================================
      .addCase(checkStaffPermissionThunk.pending, (state) => {
        state.checkingPermission = true;
        state.rolesError = null;
      })
      .addCase(checkStaffPermissionThunk.fulfilled, (state, action) => {
        state.checkingPermission = false;
        state.permissionCheck = {
          hasPermission: action.payload.hasPermission,
          staffId: action.payload.staffId,
          permission: action.payload.permission,
          roleName: action.payload.roleName
        };
        state.rolesError = null;
      })
      .addCase(checkStaffPermissionThunk.rejected, (state, action) => {
        state.checkingPermission = false;
        state.permissionCheck = null;
        state.rolesError = action.payload?.message || 'Failed to check permission';
      })

      // ==============================================
      // GET MY PERMISSIONS
      // ==============================================
      .addCase(getMyPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userPermissions = action.payload.permissions || [];
        state.userRoleName = action.payload.roleName;
        state.isAdminUser = action.payload.isAdmin;
        state.error = null;
      })
      .addCase(getMyPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch user permissions';
      })
  },
});

// ==============================================
// Actions & Reducer
// ==============================================
export const {
  clearAuthError,
  clearRolesError,
  setSelectedRole,
  clearSelectedRole,
  resetAuthState
} = authSlice.actions;

export default authSlice.reducer;


// ==============================================
// Selectors
// ==============================================
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

// Role selectors
export const selectAllRoles = (state) => state.auth.roles;
export const selectSelectedRole = (state) => state.auth.selectedRole;
export const selectRoleStaff = (state) => state.auth.roleStaff;
export const selectRolesLoading = (state) => state.auth.rolesLoading;
export const selectRolesError = (state) => state.auth.rolesError;

// Permission selectors
export const selectSelectedRolePermissions = (state) => state.auth.selectedRolePermissions;
export const selectSelectedRoleIsAdmin = (state) => state.auth.selectedRoleIsAdmin;
export const selectCheckingPermission = (state) => state.auth.checkingPermission;
export const selectPermissionCheck = (state) => state.auth.permissionCheck;
export const selectUserPermissions = (state) => state.auth.userPermissions;
export const selectUserRoleName = (state) => state.auth.userRoleName;
export const selectIsAdminUser = (state) => state.auth.isAdminUser;


// ==============================================
// Permission Helper Functions
// ==============================================
export const selectHasPermission = (state, permissionKey) => {
  const user = state.auth.user;
  if (!user) return false;
  if (state.auth.isAdminUser || user.isAdmin) return true;
  const permissions = state.auth.userPermissions || [];
  return permissions.includes(permissionKey);
};

export const selectHasAnyPermission = (state, permissionKeys) => {
  const user = state.auth.user;
  if (!user) return false;
  if (state.auth.isAdminUser || user.isAdmin) return true;
  const permissions = state.auth.userPermissions || [];
  return permissionKeys.some(key => permissions.includes(key));
};

export const selectHasAllPermissions = (state, permissionKeys) => {
  const user = state.auth.user;
  if (!user) return false;
  if (state.auth.isAdminUser || user.isAdmin) return true;
  const permissions = state.auth.userPermissions || [];
  return permissionKeys.every(key => permissions.includes(key));
};
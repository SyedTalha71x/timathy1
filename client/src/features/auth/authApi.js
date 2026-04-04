import api from '../../services/apiClient.js';

const safeRequest = async (fn) => {
    try {
        return await fn();
    } catch (err) {
        if (import.meta.env.MODE === "development") {
            console.error(err);
        }
        return { error: true };
    }
};



//logout user
export const logoutUser = async () => {
    const token = localStorage.getItem("token");
    const res = await api.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        }
    );
    localStorage.removeItem("token");
    return res.data;
};


export const getMe = async () => {
    try {
        const res = await api.get('/auth/me', { withCredentials: true });// <-- update your auth state
        return res.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const refresh = await refreshAccessToken();
            if (refresh && refresh.success) {
                const retry = await api.get('/auth/me', { withCredentials: true });// <-- update auth state after refresh
                return retry.data;
            }
        }
        throw error;
    }
};

export const refreshAccessToken = async () => {
    return await safeRequest(async () => {
        const res = await api.post('/auth/refresh', {}, { withCredentials: true });
        if (res.success && res.AccessToken) {
            localStorage.setItem("token", res.AccessToken); // store new access token if needed
        }
        return res;
    });
};


// ==============================================
// Member Apis                                 ||
// ==============================================
export const updateMember = async (updateData) => {
    const res = await api.put('/member/update', updateData, { withCredentials: true })
    return res.data;
}

export const loginMember = async (credentials) => {
    const res = await api.post('/member/login', credentials, { withCredentials: true })
    // Save token to localStorage for iOS/Capacitor where cookies don't work cross-origin
    if (res.data?.token) {
        localStorage.setItem("token", res.data.token)
    }
    return res.data;
}


// changed Password
export const changedPassword = async (updatePassword) => {
    const res = await api.put('/auth/change-password', updatePassword, { withCredentials: true })
    return res.data;
}


// ==============================================
// Staff Apis                                 ||
// ==============================================

export const StaffLogin = async (credentials) => {
    const res = await api.post('/staff/login', credentials, { withCredentials: true })
    // Save token to localStorage for iOS/Capacitor where cookies don't work cross-origin
    if (res.data?.token) {
        localStorage.setItem("token", res.data.token)
    }
    return res.data
}

// ==========================================
// All Roles Details - NO studioId parameter
// ==========================================

// Create new role
export const createRoleApi = async (data) => {
    const res = await api.post(`/role`, data, { withCredentials: true })
    return res.data
}

// Get all roles
export const getAllRolesApi = async () => {
    const res = await api.get(`/role`, { withCredentials: true })
    return res.data
}

// Get single role by ID
export const getRoleByIdApi = async (roleId) => {
    const res = await api.get(`/role/${roleId}`, { withCredentials: true })
    return res.data
}

// Update role
export const updateRoleApi = async (roleId, updateData) => {
    const res = await api.put(`/role/${roleId}`, updateData, { withCredentials: true })
    return res.data
}

// Delete role
export const deleteRoleApi = async (roleId) => {
    const res = await api.delete(`/role/${roleId}`, { withCredentials: true })
    return res.data
}

// Assign staff to role
export const assignStaffToRoleApi = async (roleId, staffIds) => {
    const res = await api.post(`/role/${roleId}/assign-staff`,
        { staffIds },
        { withCredentials: true }
    )
    return res.data
}

// Remove staff from role
export const removeStaffFromRoleApi = async (roleId, staffId) => {
    const res = await api.delete(`/role/${roleId}/staff/${staffId}`,
        { withCredentials: true }
    )
    return res.data
}

// Get all staff by role
export const getStaffByRoleApi = async (roleId) => {
    const res = await api.get(`/role/${roleId}/staff`,
        { withCredentials: true }
    )
    return res.data
}



// ============================================
// Permission Operations
// ============================================

// Get role permissions
export const getRolePermissionsApi = async (roleId) => {
    const res = await api.get(`/role/${roleId}/permissions`, { withCredentials: true })
    return res.data
}

// Update role permissions
export const updateRolePermissionsApi = async (roleId, permissions) => {
    const res = await api.put(`/role/${roleId}/permissions`,
        { permissions },
        { withCredentials: true }
    )
    return res.data
}

// Check if staff has permission
export const checkStaffPermissionApi = async (staffId, permission) => {
    const res = await api.get(`/role/check-permission/${staffId}/${permission}`,
        { withCredentials: true }
    )
    return res.data
}

// Get current user's permissions
export const getMyPermissionsApi = async () => {
    const res = await api.get(`/role/my-permissions`, { withCredentials: true })
    return res.data
}
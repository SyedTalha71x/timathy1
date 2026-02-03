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
    const token = localStorage.getItem("token"); // wherever you store it
    const res = await api.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`, // send token
            },
            withCredentials: true, // if using cookies
        }
    );
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


export const updateMember = async (updateData) => {
    const res = await api.put('/member/update', updateData, { withCredentials: true })
    return res.data;
}

export const loginMember = async (credentials) => {
    const res = await api.post('/member/login', credentials, { withCredentials: true })
    return res.data;
}


import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
    timeout: 15000
});

// Request interceptor — attach token from localStorage as Authorization header
// This ensures auth works on iOS/Capacitor where cookies aren't sent cross-origin
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default api;

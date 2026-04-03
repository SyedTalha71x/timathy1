import axios from 'axios';

console.log("API BASE URL:", import.meta.env.VITE_BACKEND_API);

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
    timeout: 15000
});

// Request interceptor — attach token + debug logging
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("REQUEST:", config.method?.toUpperCase(), config.url, "TOKEN:", token ? "exists" : "missing");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor — debug logging
api.interceptors.response.use((response) => {
    console.log("RESPONSE:", response.config.url, "STATUS:", response.status);
    return response;
}, (error) => {
    console.log("RESPONSE ERROR:", error.config?.url, "STATUS:", error.response?.status, "DATA:", JSON.stringify(error.response?.data));
    return Promise.reject(error);
});

export default api;

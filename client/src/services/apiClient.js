import axios from 'axios';
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API,
    withCredentials: true,
    timeout: 15000
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default api;

import api from "../../services/apiClient"



export const myStudio = async () => {
    const res = await api.get('/studio/my-studio',{ withCredentials: true });
    return res.data;
}
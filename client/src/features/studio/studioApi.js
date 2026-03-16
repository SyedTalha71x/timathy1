import api from "../../services/apiClient"



export const myStudio = async () => {
    const res = await api.get('/studio/my-studio', { withCredentials: true });
    return res.data;
}

export const updateStudio = async (updateData) => {
    const res = await api.put('/studio/update', updateData, { withCredentials: true })
    return res.data
}
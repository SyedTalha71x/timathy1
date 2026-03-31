import api from "../../services/apiClient"



export const myStudio = async () => {
    const res = await api.get('/studio/my-studio', { withCredentials: true });
    return res.data;
}

export const updateStudio = async (studioId, updateData) => {
    const res = await api.put(`/studio/update/${studioId}`, updateData, { withCredentials: true })
    return res.data
}



// get all studios

export const getAllStudioApi = async () => {
    const res = await api.get('/studio/', { withCredentials: true })
    return res.data
}
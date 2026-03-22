import api from '../../services/apiClient';



export const createMedical = async (mediData) => {
    const res = await api.post('/medical/', mediData, { withCredentials: true })
    return res.data
}

export const getAllForms = async () => {
    const res = await api.get('/medical/', { withCredentials: true });
    return res.data
}


export const toggleActive = async (id) => {
    const res = await api.patch(`/medical/${id}/toggle`, { withCredentials: true })
    return res.data
}


export const updateForm = async (id, updateData) => {
    const res = await api.put(`/medical/${id}`, updateData, { withCredentials: true })
    return res.data;
}
export const deleteForm = async (id) => {
    const res = await api.delete(`/medical/${id}`, { withCredentials: true })
    return res.data;
}
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
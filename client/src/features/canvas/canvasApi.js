import api from '../../services/apiClient'



export const getAllMaterialApi = async () => {
    const res = await api.get('/material/', { withCredentials: true })
    return res.data
}
export const createMaterialApi = async (data) => {
    const res = await api.post('/material/create', data, { withCredentials: true })
    return res.data
}
export const updateMaterialApi = async (id, updateData) => {
    const res = await api.put(`/material/${id}`, updateData, { withCredentials: true })
    return res.data
}
export const deleteMaterialApi = async (id) => {
    const res = await api.delete(`/material/${id}`, { withCredentials: true })
    return res.data
}
import api from '../../services/apiClient'



export const createRelation = async (relationData) => {
    const res = await api.post('/relation/create', relationData, { withCredentials: true })
    return res.data
}



export const relationByIdz = async (id) => {
    const res = await api.get(`/relation/${id}`, { withCredentials: true })
    return res.data();
}



export const allRelation = async () => {
    const res = await api.get('/relation/all', {}, { withCredentials: true })
    return res.data;
} 
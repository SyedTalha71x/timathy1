import api from '../../services/apiClient';

// create website
export const createWebsite = async (data) => {
    const res = await api.post('/website/create', data, { withCredentials: true })
    return res.data
}


// update website
export const updateWebsite = async (id, updateData) => {
    const res = await api.put(`/website/${id}`, updateData, { withCredentials: true })
    return res.data
}


// delete website
export const deleteWebsite = async (id) => {
    const res = await api.delete(`/website/${id}`, { withCredentials: true })
    return res.data
}

// get website
export const getWebsite = async () => {
    const res = await api.get('/website/', { withCredentials: true })
    return res.data
}
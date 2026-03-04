import api from '../../services/apiClient'



export const createLead = async (leadData) => {
    const res = await api.post('/lead/create', leadData, { withCredentials: true })
    return res.data
}




// all Leads

export const fetchAllLeads = async () => {
    const res = await api.get('/lead/all', { withCredentials: true })
    return res.data
}
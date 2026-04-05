import api from '../../services/apiClient'



export const createLead = async (leadData) => {
    const res = await api.post(`/lead/create`, leadData, { withCredentials: true })
    return res.data
}

// update lead 
export const updateLeadDataByStaff = async (leadId, leadData) => {
    const res = await api.put(`/lead/staff/${leadId}`, leadData, { withCredentials: true })
    return res.data
}



// all Leads

export const fetchAllLeads = async () => {
    const res = await api.get('/lead/all', { withCredentials: true })
    return res.data
}


// lead sources

export const getLeadSourcesApi = async () => {
    const res = await api.get('/lead/sources', { withCredentials: true })
    return res.data
}
export const createLeadSourcesApi = async (data) => {
    const res = await api.post('/lead/sources/create', data, { withCredentials: true })
    return res.data
}
export const updateLeadSourcesApi = async (sourceId, updateData) => {
    const res = await api.put(`/lead/sources/${sourceId}`, updateData, { withCredentials: true })
    return res.data
}
export const deleteLeadSourcesApi = async (sourceId) => {
    const res = await api.delete(`/lead/sources/${sourceId}`, { withCredentials: true })
    return res.data
}
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

// ++++++++++++++
// Medical History Response Form API Calls
// ++++++++++++++

export const createResponse = async (entityType, entityId, responseData) => {
    const res = await api.post(`/history/${entityType}/${entityId}/responses`, responseData, { withCredentials: true });
    return res.data;
}

export const getResponsesByEntity = async (entityType, entityId) => {
    const res = await api.get(`/history/${entityType}/${entityId}/responses`, { withCredentials: true });
    return res.data;
}

export const getResponseById = async (responseId) => {
    const res = await api.get(`/history/responses/${responseId}`, { withCredentials: true });
    return res.data;
}

export const updateResponse = async (responseId, updateData) => {
    const res = await api.put(`/history/responses/${responseId}`, updateData, { withCredentials: true });
    return res.data;
}

export const deleteResponse = async (responseId) => {
    const res = await api.delete(`/history/responses/${responseId}`, { withCredentials: true });
    return res.data;
}

export const generateResponsePDF = async (responseId) => {
    const res = await api.get(`/history/responses/${responseId}/pdf`, { withCredentials: true, responseType: 'blob' });
    return res.data;
}
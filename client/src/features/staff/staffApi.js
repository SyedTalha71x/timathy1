
import api from '../../services/apiClient.js';


export const allStaffData = async () => {
    const res = await api.get('/staff/all', {}, { withCredentials: true })
    return res.data
}


// =====================
// staff Creation api
// =====================

export const createStaff = async (staffData) => {
    const res = await api.post('/staff/create', staffData, { withCredentials: true })
    return res.data
}

// ====================
// Update Staff-Member by Staff
// =====================

export const updateStaff = async (staffId, updateData) => {
    const res = await api.put(`/staff/${staffId}`, updateData, { withCredentials: true })
    return res.data
}


// =================
// Delete Staff
// =================
export const deleteStaff = async (staffId) => {
    const res = await api.delete(`/staff/${staffId}`, { withCredentials: true })
    return res.data
}


//  update login staff

export const updateStaffByUserID = async (updateData) => {
    const res = await api.put('/staff/update', updateData, { withCredentials: true })
    return res.data
}


// *****************
// create shift
// ******************

export const createShift = async (data) => {
    const res = await api.post('/shift/create', data, { withCredentials: true })
    return res.data
}
// *****************
// update shift
// ******************

export const updateShift = async (id, update) => {
    const res = await api.put(`/shift/${id}`, update, { withCredentials: true })
    return res.data
}
// *****************
// delete shift
// ******************

export const deleteShift = async (id) => {
    const res = await api.delete(`/shift/${id}`, { withCredentials: true })
    return res.data
}
// *****************
// get shift
// ******************

export const getShift = async () => {
    const res = await api.get('/shift/', { withCredentials: true })
    return res.data
}


// ***************
// Checked In
// ***************

export const checkedIn = async (id) => {
    const res = await api.patch(`/shift/${id}/check-in`, { withCredentials: true })
    return res.data;
}




// &&&&&&&&&&&&&
// Vacation Apis
// &&&&&&&&&&&&&&

export const sendVacationRequestApi = async (data) => {
    const res = await api.post('/vacation/send', data, { withCredentials: true })
    return res.data
}

// &&&&&&&
// Get All Vacation Request
// &&&&&&&&&&&&

export const getVacationRequestsApi = async () => {
    const res = await api.get('/vacation/', { withCredentials: true })
    return res.data
}
// &&&&&&&
// Get All Pending Vacation Request
// &&&&&&&&&&&&

export const getPendingVacationRequestsApi = async () => {
    const res = await api.get('/vacation/pending', { withCredentials: true })
    return res.data
}


// &&&&&&&&&&&&&
// Approved Request
// &&&&&&&&&&&&&
export const approvedVacationRequestApi = async (id) => {
    const res = await api.patch(`/vacation/${id}/approved`, { withCredentials: true })
    return res.data
}
// &&&&&&&&&&&&&
// Rejected Vacation Request
// &&&&&&&&&&&&&
export const rejectVacationRequestApi = async (id) => {
    const res = await api.patch(`/vacation/${id}/rejected`, { withCredentials: true })
    return res.data
}



// ^^^^^^^^^^^
// Document APIs
// ^^^^^^^^^^^

export const uploadDocumentApi = async (entityType, entityId, formData) => {
    const res = await api.post(`/staff/${entityType}/${entityId}/upload`, formData, { withCredentials: true })
    return res.data
}

export const deleteDocumentApi = async (entityType, entityId, documentId) => {
    const res = await api.delete(`/staff/${entityType}/${entityId}/${documentId}`, { withCredentials: true })
    return res.data
}

export const updateDocumentApi = async (documentId, updateData) => {
    const res = await api.patch(`/staff/${documentId}`, updateData, { withCredentials: true })
    return res.data
}

export const getDocumentByIdApi = async (documentId) => {
    const res = await api.get(`/staff/details/${documentId}`, { withCredentials: true })
    return res.data
}

export const getAllDocumentsByEntityApi = async (entityType, entityId) => {
    const res = await api.get(`/staff/${entityType}/${entityId}`, { withCredentials: true })
    return res.data
}   
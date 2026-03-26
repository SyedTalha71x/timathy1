
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
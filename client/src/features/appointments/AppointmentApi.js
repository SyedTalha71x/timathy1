import api from '../../services/apiClient'


export const myAppointments = async () => {
    const res = await api.get('/appointment/myAppointments', { withCredentials: true })
    return res.data
}


export const createAppointment = async (appointmentData) => {
    const res = await api.post('/appointment/create', appointmentData, { withCredentials: true })
    return res.data
}

export const createBlockAppointment = async (blockAppointment) => {
    const res = await api.post('/appointment/block', blockAppointment, { withCredentials: true })
    return res.data
}

export const canceledAppointment = async (appointmentId) => {
    const res = await api.patch(`/appointment/${appointmentId}/cancel`, {}, { withCredentials: true })
    return res.data;
}


// All Appointments show on staff 

export const allAppointments = async () => {
    const res = await api.get('/appointment/all-appointments', { withCredentials: true })
    return res.data;
}

export const appointmentByMemberId = async (memberId) => {
    const res = await api.get(`/appointment/member/${memberId}`, { withCredentials: true })
    return res.data;
}


// appointment create by staff for member
export const createAppointmentByStaff = async (memberId, appointmentData) => {
    const res = await api.post(`/appointment/create/${memberId}`, appointmentData, { withCredentials: true })
    return res.data;
}


export const createBookingTrialByStaff = async (leadId, trialData) => {
    const res = await api.post(`/appointment/trial/${leadId}`, trialData, { withCredentials: true })
    return res.data;
}



// =============================
// Update and Delete Appointment By Staff
// =============================

export const updateAppointment = async (appointmentId, updateData) => {
    const res = await api.put(`/appointment/${appointmentId}`, updateData, { withCredentials: true })
    return res.data
}


export const deleteAppointment = async (appointmentId) => {
    const res = await api.delete(`/appointment/${appointmentId}`, { withCredentials: true })
    return res.data
}




export const getAllPendingAppointmentsApi = async () => {
    const res = await api.get('/appointment/pending', { withCredentials: true })
    return res.data
}


export const approvedAppointmentApi = async (appointmentId) => {
    const res = await api.patch(`/appointment/approved/${appointmentId}`, { withCredentials: true })
    return res.data
}
export const rejectedAppointmentApi = async (appointmentId) => {
    const res = await api.patch(`/appointment/rejected/${appointmentId}`, { withCredentials: true })
    return res.data
}


// &&&&&&&&& 
// ALL Appointment CATEGORY APIS
// &&&&&&&&&&&&&&



// &&& CREATE CATEGORY FOR CLASS-TYPES &&&

export const createCategoryApi = async (data) => {
    const res = await api.post('/service/category/create', data, { withCredentials: true })
    return res.data
}

// &&& get All Category &&&

export const getCategoryApi = async () => {
    const res = await api.get('/service/categories', { withCredentials: true })
    return res.data
}


// update category
export const updateCategoryApi = async (id, updateData) => {
    const res = await api.put(`/service/category/${id}`, updateData, { withCredentials: true })
    return res.data
}

// delete category

export const deleteCategoryApi = async (id) => {
    const res = await api.delete(`/service/category/${id}`, { withCredentials: true })
    return res.data
}




// ***************
// Appointment Types Thunk
// ***********************


export const createAppointmentTypesApi = async (data) => {
    const res = await api.post('/appointment/types/create', data, { withCredentials: true })
    return res.data
}
export const updateAppointmentTypesApi = async (typeId, updateData) => {
    const res = await api.put(`/appointment/types/${typeId}`, updateData, { withCredentials: true })
    return res.data
}
export const deleteAppointmentTypesApi = async (typeId) => {
    const res = await api.delete(`/appointment/types/${typeId}`, { withCredentials: true })
    return res.data
}
export const getAppointmentTypesApi = async () => {
    const res = await api.get('/appointment/types', { withCredentials: true })
    return res.data
}
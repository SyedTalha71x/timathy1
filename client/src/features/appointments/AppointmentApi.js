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
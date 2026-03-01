import api from '../../services/apiClient'


export const myAppointments = async () => {
    const res = await api.get('/appointment/myAppointments', { withCredentials: true })
    return res.data
}


export const createAppointment = async (appointmentData) => {
    const res = await api.post('/appointment/create', appointmentData, { withCredentials: true })
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
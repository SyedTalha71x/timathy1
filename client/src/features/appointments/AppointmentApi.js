import api from '../../services/apiClient'


export const myAppointments = async () => {
    const res = await api.get('/appointment/myAppointments', { withCredentials: true })
    return res.data
}


export const createAppointment = async (appointmentData) => {
    const res = await api.post('/appointment/create', appointmentData, { withCredentials: true })
    return res.data
}
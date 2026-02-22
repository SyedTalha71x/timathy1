import api from '../../services/apiClient';

export const myReminder = async () => {
    const res = await api.get('/reminder/myReminder', { withCredentials: true })
    return res.data
}

export const updateReminder = async (updateReminderData, appointmentId) => {
    const res = await api.put(`/reminder/myReminder/${appointmentId}`, updateReminderData, { withCredentials: true })
    return res.data;
}
import api from '../../services/apiClient';

export const myReminder = async () => {
    const res = await api.get('/reminder/myReminder', { withCredentials: true })
    return res.data
}

export const updateReminder = async (appointmentId, reminderData) => {
    const res = await api.put(`/reminder/${appointmentId}`, reminderData, { withCredentials: true })
    return res.data;
}

export const nutritionNotification = async () => {
    const res = await api.get('/nutrition/reminder//my-nutrition-reminder', { withCredentials: true })
    return res.data
}

export const updateNutritionNotification = async (updates) => {
    const res = await api.put('/nutrition/reminder/update', updates, { withCredentials: true })
    return res.data
}
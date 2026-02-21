import api from '../../services/apiClient'


export const dailySummery = async () => {
    const res = await api.get('/food/daily-summery', {}, { withCredentials: true });
    return res.data
}
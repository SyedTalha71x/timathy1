import api from '../../services/apiClient';



export const createGoal = async (goalData) => {
    const res = await api.post('/goal/create-goal', goalData, { withCredentials: true })
    return res.data
}
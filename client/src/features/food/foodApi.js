import api from '../../services/apiClient'

export const getFood = async () => {
    const res = await api.get('/food/get-food', {}, { withCredientails: true })
    return res.data;
}


export const createFood = async (newFoodData) => {
    const res = await api.post('/food/create-food', newFoodData, { withCredentials: true })
    return res.data;
}
import api from '../../services/apiClient'





export const getAllMyTrainings = async () => {
    try {
        const response = await api.get('/training/training-videos', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching trainings:', error);
        throw error;
    }
} 


// myPlans

export const getMyTrainingPlans = async () => {
    try {
        const response = await api.get('/plan/myPlan', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching my training plans:', error);
        throw error;
    }
}
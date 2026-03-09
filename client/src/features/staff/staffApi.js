
import api from '../../services/apiClient.js';


export const allStaffData = async () => {
    const res = await api.get('/staff/all', {}, { withCredentials: true })
    return res.data
}
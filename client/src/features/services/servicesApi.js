import api from '../../services/apiClient';



export const myServices = async () => {
    const res = await api.get("/service/myServices", { withCredentials: true })
    return res.data;
}
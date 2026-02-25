import api from '../../services/apiClient';



export const studioServices = async () => {
    const res = await api.get("/service/studio-services", { withCredentials: true })
    return res.data;
}
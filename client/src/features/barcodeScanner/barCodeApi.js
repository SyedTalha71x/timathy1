import api from '../../services/apiClient'


export const foodByBarcode = async (code) => {
    const res = await api.get(`/food/barcode/${code}`, { withCredentials: true })
    return res.data
}
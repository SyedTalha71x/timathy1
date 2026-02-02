import api from '../../services/apiClient.js';


export const loginMember = async (credentials) => {
    const res = await api.post('/member/login', credentials, { withCredentials: true })
    return res.data;
}



export const registerMember = async (memberData) => {
    const res = await api.post('/member/create', memberData, { withCredentials: true })
    return res.data
}
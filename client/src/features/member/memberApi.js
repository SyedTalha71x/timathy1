import api from '../../services/apiClient.js';




export const registerMember = async (memberData) => {
    const res = await api.post('/member/create', memberData, { withCredentials: true })
    return res.data
}


export const allMember = async () => {
    const res = await api.get('/member/members', {}, { withCredentials: true })
    return res.data
}


export const temporaryMember = async (memberData) => {
    const res = await api.post('/member/temporary', memberData, { withCredentials: true })
    return res.data
}
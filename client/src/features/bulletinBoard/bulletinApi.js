import api from '../../services/apiClient'




export const getAllPostApi = async () => {
    const res = await api.get('/post/', { withCredentials: true })
    return res.data
}
export const createPostApi = async (data) => {
    const res = await api.post('/post/create', data, { withCredentials: true })
    return res.data
}
export const updatePostApi = async (postId, updateData) => {
    const res = await api.put(`/post/${postId}`, updateData, { withCredentials: true })
    return res.data
}
export const deletePostApi = async (postId) => {
    const res = await api.delete(`/post/${postId}`, { withCredentials: true })
    return res.data
}
export const activePostApi = async (postId) => {
    const res = await api.patch(`/post/${postId}/active`, { withCredentials: true })
    return res.data
}
export const deActivePostApi = async (postId) => {
    const res = await api.patch(`/post/${postId}/in-active`, { withCredentials: true })
    return res.data
}
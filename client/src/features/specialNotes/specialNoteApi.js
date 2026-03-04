import api from '../../services/apiClient'



export const createNote = async (noteData) => {
    const res = await api.post('/special/create', noteData, { withCredentials: true })
    return res.data
}

// auto fetching special note with member or lead _id
export const specialNoteByIdz = async (id) => {
    const res = await api.get(`/special/note/${id}`, { withCredentials: true })
    return res.data
}
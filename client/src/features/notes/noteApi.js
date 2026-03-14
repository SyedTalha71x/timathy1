import api from '../../services/apiClient'


// notes creation for studio
export const createNoteForStudio = async (noteData) => {
    const res = await api.post('/notes/studio/create', noteData, { withCredentials: true })
    return res.data
}

// personal notes creation 
export const createNote = async (noteData) => {
    const res = await api.post('/notes/user/create', noteData, { withCredentials: true })
    return res.data
}

// get notes of studio 
export const getNotesOfStudio = async () => {
    const res = await api.get('/notes/studio/get', { withCredentials: true })
    return res.data
}
// personal notes
export const getNotes = async () => {
    const res = await api.get('/notes/user/get', { withCredentials: true })
    return res.data
}




// update notes 
export const updateNotes = async (noteId, updateData) => {
    const res = await api.put(`/notes/${noteId}`, updateData, { withCredentials: true })
    return res.data
}


// delete note
export const deleteNote = async (noteId) => {
    const res = await api.delete(`/notes/${noteId}`, { withCredentials: true })
    return res.data
}
import api from '../../services/apiClient'



// create Tags 
export const createTag = async (tagData) => {
    const res = await api.post('/todos/tags/create', tagData, { withCredentials: true })
    return res.data
}


// create Tasks 
export const createTask = async (taskData) => {
    const res = await api.post('/todos/create', taskData, { withCredentials: true })
    return res.data
}



// getTasks
export const getTasks = async () => {
    const res = await api.get('/todos/all', { withCredentials: true })
    return res.data
}

// get Tags
export const getTags = async () => {
    const res = await api.get('/todos/tags/all', { withCredentials: true })
    return res.data
}
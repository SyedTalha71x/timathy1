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



// task Completed

export const completedTask = async (todoId) => {
    const res = await api.patch(`/todos/${todoId}/completed`, { withCredentials: true })
    return res.data
}
// task canceled

export const canceledTask = async (todoId) => {
    const res = await api.patch(`/todos/${todoId}/canceled`, { withCredentials: true })
    return res.data
}


// ===========
// update Task
// ===========

export const updateTask = async (todoId, updateData) => {
    const res = await api.put(`/todos/${todoId}`, updateData, { withCredentials: true })
    return res.data
}

// ==========
// Delete Task
// ==========

export const deleteTask = async (todoId) => {
    const res = await api.delete(`/todos/${todoId}`, { withCredentials: true })
    return res.data;
}
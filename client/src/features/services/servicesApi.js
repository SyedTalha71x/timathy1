import api from '../../services/apiClient';


// get all Appointment Types
export const studioServices = async () => {
    const res = await api.get("/service/studio-services", { withCredentials: true })
    return res.data;
}

// create AppointmentType

export const createAppointmentTypes = async (data) => {
    const res = await api.post("/service/create", data, { withCredentials: true })
    return res.data;
}

// update Appointment Type
export const updateAppointmentTypes = async (id, updateData) => {
    const res = await api.put(`/service/${id}`, updateData, { withCredentials: true })
    return res.data;
}


// Delete Appointment Type
export const deleteAppointmentTypes = async (id) => {
    const res = await api.delete(`/service/${id}`, { withCredentials: true })
    return res.data;
}


// &&&&&&&&& 
// ALL Appointment CATEGORY APIS
// &&&&&&&&&&&&&&



// &&& CREATE CATEGORY FOR CLASS-TYPES &&&

export const createCategoryApi = async (data) => {
    const res = await api.post('/service/category/create', data, { withCredentials: true })
    return res.data
}

// &&& get All Category &&&

export const getCategoryApi = async () => {
    const res = await api.get('/service/categories', { withCredentials: true })
    return res.data
}


// update category
export const updateCategoryApi = async (id, updateData) => {
    const res = await api.put(`/service/category/${id}`, updateData, { withCredentials: true })
    return res.data
}

// delete category

export const deleteCategoryApi = async (id) => {
    const res = await api.delete(`/service/category/${id}`, { withCredentials: true })
    return res.data
}
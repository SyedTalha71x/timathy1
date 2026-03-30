import api from '../../services/apiClient';


// &&&&&&&&& 
// ALL CATEGORY APIS
// &&&&&&&&&&&&&&



// &&& CREATE CATEGORY FOR CLASS-TYPES &&&

export const createCategoryApi = async (data) => {
    const res = await api.post('/class/category/create', data, { withCredentials: true })
    return res.data
}

// &&& get All Category &&&

export const getCategoryApi = async () => {
    const res = await api.get('/class/categories', { withCredentials: true })
    return res.data
}


// update category
export const updateCategoryApi = async (id, updateData) => {
    const res = await api.put(`/class/category/${id}`, updateData, { withCredentials: true })
    return res.data
}

// delete category

export const deleteCategoryApi = async (id) => {
    const res = await api.delete(`/class/category/${id}`, { withCredentials: true })
    return res.data
}


// **********
// All Class-Types APIs
// *************    


// *** create Class-type ***

export const createClassTypeApi = async (data) => {
    const res = await api.post('/class/type/create', data, { withCredentials: true })
    return res.data
}



//  *** update class-type ***

export const updateClassTypeApi = async (typeId, updateData) => {
    const res = await api.put(`/class/type/${typeId}`, updateData, { withCredentials: true })
    return res.data
}



// **** delete class ***

export const deleteClassTypeApi = async (typeId) => {
    const res = await api.delete(`/class/type/${typeId}`, { withCredentials: true })
    return res.data
}


// **** get all class-Types ****

export const getClassTypeApi = async () => {
    const res = await api.get('/class/types', { withCredentials: true })
    return res.data
}



// $$$$$$$$ 
// ALL CLASSES APIS
// $$$$$$$$$$$$$

// $$$ create class $$$$

export const createClassApi = async (data) => {
    const res = await api.post('/class/create', data, { withCredentials: true })
    return res.data;
}


// $$$ get all classes $$$

export const getAllClassesApi = async () => {
    const res = await api.get('/class/', { withCredentials: true })
    return res.data
}


// $$ update class Data $$


export const updateClassApi = async (classId, updateData) => {
    const res = await api.put(`/class/${classId}`, updateData, { withCredentials: true })
    return res.data
}


// $$ Delete Class Data $$

export const deleteClassApi = async (classId) => {
    const res = await api.delete(`/class/${classId}`, { withCredentials: true })
    return res.data
}


// add participants in class

export const enrollParticipantApi = async (classId) => {
    const res = await api.patch(`/class/enroll/${classId}`, { withCredentials: true })
    return res.data
}


// remove participants from class

export const removeParticipantApi = async (classId) => {
    const res = await api.patch(`/class/remove-enrolled/${classId}`, { withCredentials: true })
    return res.data
}



// cancel Class 
export const cancelClassApi = async (classId) => {
    const res = await api.patch(`/class/cancel/${classId}`, { withCredentials: true })
    return res.data
}

// enroll member himself in class

export const enrollMySelfInClassApi = async (classId) => {
    const res = await api.patch(`/class/${classId}/enroll`, { withCredentials: true })
    return res.data
}
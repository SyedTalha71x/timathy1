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
export const updateAppointmentTypes = async (serviceId, updateData) => {
    const res = await api.put(`/service/${serviceId}`, updateData, { withCredentials: true })
    return res.data;
}


// Delete Appointment Type
export const deleteAppointmentTypes = async (serviceId) => {
    const res = await api.delete(`/service/${serviceId}`, { withCredentials: true })
    return res.data;
}


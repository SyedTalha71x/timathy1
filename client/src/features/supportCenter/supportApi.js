import api from '../../services/apiClient'


// +++++++++++++++
// All feedback Apis
// ++++++++++++++++


// ------
// create feedback
// -------
export const createFeedbackApi = async (data) => {
    const res = await api.post('/feedback/create', data, { withCredentials: true })
    return res.data;
}
// ------
// get feedback
// -------
export const fetchFeedbackApi = async () => {
    const res = await api.get('/feedback/', { withCredentials: true })
    return res.data;
}




// +++++++++++++++
// All Ticket Apis
// ++++++++++++++++



// ------
// create Ticket
// -------
export const createTicketApi = async (data) => {
    const res = await api.post('/ticket/create', data, { withCredentials: true })
    return res.data;
}
// ------
// get Ticket
// -------
export const fetchTicketApi = async () => {
    const res = await api.get('/ticket/', { withCredentials: true })
    return res.data;
}
// ------
// update Ticket
// -------
export const updateTicketApi = async (id, updateData) => {
    const res = await api.put(`/ticket/${id}`, updateData, { withCredentials: true })
    return res.data;
}
// ------
// delete Ticket
// -------
export const deleteTicketApi = async (id) => {
    const res = await api.delete(`/ticket/${id}`, { withCredentials: true })
    return res.data;
}
// ------
// isClosed Ticket
// -------
export const isClosedTicketApi = async (id) => {
    const res = await api.patch(`/ticket/${id}/closed`, { withCredentials: true })
    return res.data;
}
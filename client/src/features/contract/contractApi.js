import api from '../../services/apiClient'




// *************
// All Contract Reason
// ******************

// ***
// Pause Reason
// *********

// create 

export const createPauseReasonApi = async (data) => {
    const res = await api.post('/contract/pause/create', data, { withCredentials: true })
    return res.data
}

// get
export const fetchPauseReasonApi = async () => {
    const res = await api.get('/contract/pauses', { withCredentials: true })
    return res.data
}

// update
export const updatePauseReasonApi = async (pauseId, updateData) => {
    const res = await api.put(`/contract/pause/${pauseId}`, updateData, { withCredentials: true })
    return res.data
}

// delete 

export const deletePauseReasonApi = async (pauseId) => {
    const res = await api.delete(`/contract/pause/${pauseId}`, { withCredentials: true })
    return res.data
}








// *********
// All Renew Reason
// ****************


// create 

export const createRenewReasonApi = async (data) => {
    const res = await api.post('/contract/renew/create', data, { withCredentials: true })
    return res.data
}
// get 
export const fetchRenewReasonApi = async () => {
    const res = await api.get('/contract/renew', { withCredentials: true })
    return res.data
}
// update
export const updateRenewReasonApi = async (renewId, updateData) => {
    const res = await api.put(`/contract/renew/${renewId}`, updateData, { withCredentials: true })
    return res.data
}
// delete
export const deleteRenewReasonApi = async (renewId) => {
    const res = await api.delete(`/contract/renew/${renewId}`, { withCredentials: true })
    return res.data
}

// *********
// All Changes Reason
// ****************
// create 

export const createBonusReasonApi = async (data) => {
    const res = await api.post('/contract/bonus/create', data, { withCredentials: true })
    return res.data
}

// get
export const fetchBonusReasonApi = async () => {
    const res = await api.get('/contract/bonuses', { withCredentials: true })
    return res.data
}
// update
export const updateBonusReasonApi = async (bonusId, updateData) => {
    const res = await api.put(`/contract/bonus/${bonusId}`, updateData, { withCredentials: true })
    return res.data
}
// delete
export const deleteBonusReasonApi = async (bonusId) => {
    const res = await api.delete(`/contract/bonus/${bonusId}`, { withCredentials: true })
    return res.data
}




// *********
// All Changes Reason
// ****************

// create 

export const createChangeReasonApi = async (data) => {
    const res = await api.post('/contract/change/create', data, { withCredentials: true })
    return res.data
}
// get
export const fetchChangeReasonApi = async () => {
    const res = await api.get('/contract/changes', { withCredentials: true })
    return res.data
}
// update
export const updateChangeReasonApi = async (changeId, updateData) => {
    const res = await api.put(`/contract/change/${changeId}`, updateData, { withCredentials: true })
    return res.data
}
// delete
export const deleteChangeReasonApi = async (changeId) => {
    const res = await api.delete(`/contract/change/${changeId}`, { withCredentials: true })
    return res.data
}



// ***********
// VAtRate Apis 
// ++++++++++++++++


export const getVatRateApi = async () => {
    const res = await api.get('/service/vat-rates', { withCredentials: true })
    return res.data
}
export const createVatRateApi = async (data) => {
    const res = await api.post('/service/vat-rates/create', data, { withCredentials: true })
    return res.data
}
export const updateVatRateApi = async (id, updateData) => {
    const res = await api.put(`/service/vat-rates/${id}`, updateData, { withCredentials: true })
    return res.data
}
export const deleteVatRateApi = async (id) => {
    const res = await api.delete(`/service/vat-rates/${id}`, { withCredentials: true })
    return res.data
}





// contract forms

export const getContractFormsApi = async () => {
    const res = await api.get('/contract/contractForms', { withCredentials: true })
    return res.data
}


export const createContractFormApi = async (data) => {
    const res = await api.post('/contract/contractForms/create', data, { withCredentials: true })
    return res.data
}


export const updateContractFormApi = async (formId, updateData) => {
    const res = await api.put(`/contract/contractForms/${formId}`, updateData, { withCredentials: true })
    return res.data
}

export const deleteContractFormApi = async (formId) => {
    const res = await api.delete(`/contract/contractForms/${formId}`, { withCredentials: true })
    return res.data
}
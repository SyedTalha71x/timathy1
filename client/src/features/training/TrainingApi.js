import api from '../../services/apiClient'


//   ==== All Training Video Api are Below ====
// training videos

export const getAllMyTrainings = async () => {

    const response = await api.get('/training/training-videos', {}, { withCredentials: true });
    return response.data;

}

// upload video in training video center
export const uploadVideo = async (videoData) => {
    const res = await api.post('/training/upload/video', videoData, { withCredentials: true })
    return res.data;
}


// === All Training Plan Api are Below ===

// --- myPlans ---

export const getMyTrainingPlans = async () => {

    const response = await api.get('/plan/myPlan', {}, { withCredentials: true });
    return response.data;

}

// create Plan

export const createTrainingPlan = async (planData) => {
    const res = await api.post('/plan/create', planData, { withCredentials: true })
    return res.data
}

//  all training plan to show
export const getAllTrainingPlans = async () => {
    const res = await api.get('/plan/all', { withCredentials: true });
    return res.data;

}
// Update Plan

export const updateTrainingPlan = async (planId, planData) => {
    const res = await api.put(`/plan/update/${planId}`, planData, { withCredentials: true })
    return res.data
}


//  plan Assigned to Member

export const assignPlanToMember = async (memberId, planId) => {
    const res = await api.post(`/plan/assign/${memberId}`, { planId }, { withCredentials: true })
    return res.data
}
//  remove member from plan
export const removePlanToMember = async (memberId, planId) => {
    const res = await api.post(`/plan/remove/${memberId}`, { planId }, { withCredentials: true })
    return res.data
}


// all assigned plans of members

export const getAllAssignedPlansOfMember = async (memberId) => {
    const res = await api.get(`/plan/assigned/${memberId}`, {}, { withCredentials: true })
    return res.data
}
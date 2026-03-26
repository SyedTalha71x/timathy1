import api from '../../services/apiClient.js';

export const registerMember = async (memberData) => {
    const res = await api.post('/member/create', memberData, { withCredentials: true })
    return res.data
}

export const allMember = async () => {
    const res = await api.get('/member/members', { withCredentials: true })
    return res.data
}

export const temporaryMember = async (memberData) => {
    const res = await api.post('/member/temporary', memberData, { withCredentials: true })
    return res.data
}

// update member by Staff 
export const updateMemberByStaff = async (memberId, updateMember) => {
    const res = await api.put(`/member/staff/${memberId}`, updateMember, { withCredentials: true })
    return res.data
}

// ============================================
// Member Profile Update Approval Workflow
// ============================================

/**
 * Get pending profile updates (for staff/admin)
 */
export const getPendingProfileUpdates = async () => {
    const res = await api.get('/member/admin/pending-updates', { withCredentials: true })
    return res.data
}

/**
 * Approve member profile update
 * @param {string} memberId - The ID of the member
 */
export const approveProfileUpdate = async (memberId) => {
    const res = await api.put(`/member/admin/approve-update/${memberId}`, {}, { withCredentials: true })
    return res.data
}

/**
 * Reject member profile update
 * @param {string} memberId - The ID of the member
 * @param {string} reason - Reason for rejection
 */
export const rejectProfileUpdate = async (memberId, reason) => {
    const res = await api.put(`/member/admin/reject-update/${memberId}`, { reason }, { withCredentials: true })
    return res.data
}

/**
 * Get profile update status for logged-in member
 */
export const getProfileUpdateStatus = async () => {
    const res = await api.get('/member/profile/update-status', { withCredentials: true })
    return res.data
}
const express = require('express');
const {
    createMember,
    loginMember,
    updateUserById,
    deleteMemberById,
    getMemberById,
    getMembers,
    updateMemberCheckIn,
    createTemporaryMember,
    updateMemberByStaff,
    getPendingProfileUpdates,
    getProfileUpdateStatus,
    rejectProfileUpdate,
    approveProfileUpdate
    // logoutMember
} = require('../controllers/MemberController');
const { verifyAccessToken } = require('../middleware/verifyToken');
const { isAdmin, isStaff } = require('../middleware/RoleCheck');
const { uploadImage } = require('../config/upload');

const router = express.Router();

// Public routes
router.post('/login', loginMember);
// router.post('/logout', logoutMember);

// Protected routes (all require authentication)
router.use(verifyAccessToken);

// Member's own profile routes
router.get('/profile', getMemberById);
router.put('/update', updateUserById);

// Staff routes
router.get('/members', isStaff, getMembers);
router.patch('/check-in/:id', isStaff, updateMemberCheckIn);
router.post('/temporary', isStaff, uploadImage.single('img'), createTemporaryMember);
router.put('/staff/:memberId', isStaff, uploadImage.single('img'), updateMemberByStaff);

// Admin routes
router.post('/create', isAdmin, uploadImage.single('img'), createMember);
router.delete('/:id', isAdmin, deleteMemberById);


// In your routes file

router.get('/profile/update-status', getProfileUpdateStatus);

// Staff/Admin routes
router.get('/admin/pending-updates', isStaff || isAdmin, getPendingProfileUpdates);
router.put('/admin/approve-update/:memberId', isStaff || isAdmin, approveProfileUpdate);
router.put('/admin/reject-update/:memberId', isStaff || isAdmin, rejectProfileUpdate);


// Admin/Staff shared routes
// router.get('/:id', isAdminOrStaff, getMemberById);

module.exports = router;
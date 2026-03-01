const express = require('express');
const {
    createMember,
    loginMember,
    updateUserById,
    deleteMemberById,
    getMemberById,
    getMembers,
    updateMemberCheckIn
} = require('../controllers/MemberController');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken');
const { isAdmin, isStaff } = require('../middleware/RoleCheck');
// const upload = require('../config/upload')
const router = express.Router();

router.get('/members', verifyAccessToken, isStaff, getMembers)
router.get('/:id', verifyAccessToken, getMemberById)
router.post('/create', verifyAccessToken, isAdmin, createMember)
router.post('/login', loginMember)
router.put('/update', verifyAccessToken, updateUserById)
router.delete('/:id', verifyAccessToken, isAdmin, deleteMemberById)
router.patch('/check-in/:id', verifyAccessToken, updateMemberCheckIn)
module.exports = router
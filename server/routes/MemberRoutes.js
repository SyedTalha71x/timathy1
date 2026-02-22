const express = require('express');
const {
    createMember,
    loginMember,
    updateUserById,
    deleteMemberById,
    getMemberById,
    getMembers,
} = require('../controllers/MemberController');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/RoleCheck');
// const upload = require('../config/upload')
const router = express.Router();

router.get('/members', verifyAccessToken, isAdmin, getMembers)
router.get('/:id', verifyAccessToken, getMemberById)
router.post('/create', createMember)
router.post('/login', loginMember)
router.put('/update', verifyAccessToken, updateUserById)
router.delete('/:id', verifyAccessToken, isAdmin, deleteMemberById)

module.exports = router
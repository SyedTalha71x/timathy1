const express = require('express');
const {
    createStaff,
    loginStaff,
    updateStaffById,
    getStaffById,
    getStaff,
    deleteStaffById,
} = require('../controllers/StaffController');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken');
const { isAdmin, isStaff } = require('../middleware/RoleCheck');
const { uploadImage } = require('../config/upload')
const router = express.Router();


router.get('/all', verifyAccessToken, isStaff || isAdmin, getStaff)
router.get('/:staffId', verifyAccessToken, getStaffById)
router.post('/create', uploadImage.single('img'), verifyAccessToken, isStaff || isAdmin, createStaff)
router.post('/login', loginStaff)
router.put('/:staffId', uploadImage.single('img'), verifyAccessToken, updateStaffById)
router.delete('/:staffId', verifyAccessToken, deleteStaffById)

module.exports = router
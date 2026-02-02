const express = require('express');
const { createAdmin, loginAdmin, getUsers, updateAdminById, deleteUser } = require('../controllers/AdminController');
const { isAdmin } = require('../middleware/RoleCheck');
const { verifyAccessToken } = require('../middleware/verifyToken');
const { forgetPassword, resetPassword, requestEmailChange, changePassword } = require('../controllers/AuthController');

const router = express.Router();


router.post('/create', createAdmin)
router.put('/:id',  updateAdminById)
router.post('/login', loginAdmin)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/reset-email', verifyAccessToken, requestEmailChange)
router.post('/changePassword', verifyAccessToken, changePassword)
router.get('/users', verifyAccessToken, isAdmin, getUsers)
router.delete('/:id', verifyAccessToken, isAdmin, deleteUser)


module.exports = router
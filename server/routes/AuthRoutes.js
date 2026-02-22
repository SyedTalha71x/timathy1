const express = require('express')

const { logout, getMe, newAccessToken, forgetPassword, resetPassword, requestEmailChange, changePassword } = require('../controllers/AuthController');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken')
const router = express.Router();

router.get('/me', verifyAccessToken, getMe)
router.post('/logout', verifyAccessToken, logout)
router.post('/refresh', verifyRefreshToken, newAccessToken)
router.put('/change-password', verifyAccessToken, changePassword)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)
// router.post('/reset-email', verifyAccessToken, requestEmailChange)

module.exports = router
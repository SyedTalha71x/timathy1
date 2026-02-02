const express = require('express')
const { logout, getMe, newAccessToken } = require('../controllers/AuthController')
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken')
const router = express.Router();

router.get('/me', verifyAccessToken, getMe)
router.post('/logout', verifyAccessToken, logout)
router.post('/refresh', verifyRefreshToken, newAccessToken)



module.exports = router
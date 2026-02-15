const express = require('express')
const router = express.Router()

// upload video
const { upload } = require('../config/upload')

// controller

const { createTrainingVideoUpload, getAllTrainingVideos } = require('../controllers/TrainingPlanVideoController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isStaff, isAdmin } = require('../middleware/RoleCheck')

router.post('/upload/video', verifyAccessToken, isAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'videoUrl', maxCount: 1 }]), createTrainingVideoUpload)
router.get('/training-videos', verifyAccessToken, getAllTrainingVideos)




module.exports = router
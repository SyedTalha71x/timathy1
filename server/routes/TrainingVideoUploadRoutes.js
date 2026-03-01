const express = require('express')
const router = express.Router()

// upload video
const { uploadImage,uploadVideo } = require('../config/upload')

// controller

const { createTrainingVideoUpload, getAllTrainingVideos, deleteTrainingVideoById } = require('../controllers/TrainingPlanVideoController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isStaff, isAdmin } = require('../middleware/RoleCheck')

router.post('/upload/video', verifyAccessToken, isAdmin, uploadImage.single('thumbnail'), uploadVideo.single('videoUrl'), createTrainingVideoUpload)
router.get('/training-videos', verifyAccessToken, getAllTrainingVideos)
router.delete('/:videoId', verifyAccessToken, deleteTrainingVideoById)



module.exports = router
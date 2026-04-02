const express = require('express')

const { createPost, getAllPosts, updatePost, deletePost, activePost, deactivatePost } = require('../controllers/PostController')


const { verifyAccessToken } = require('../middleware/verifyToken')
const {uploadImage} = require('../config/upload')

const router = express.Router()

router.use(verifyAccessToken)


router.post('/create',uploadImage.single('img'), createPost)
router.get('/', getAllPosts)
router.put('/:postId', updatePost)
router.delete('/:postId', deletePost)
router.patch('/:postId/active', activePost)
router.patch('/:postId/in-active', deactivatePost)


module.exports = router
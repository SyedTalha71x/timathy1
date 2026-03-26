const express = require('express')
const { createFeedback, getFeedback, deleteFeedback } = require('../controllers/FeedbackController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isAdmin, isStaff } = require('../middleware/RoleCheck')

const router = express.Router()

router.use(verifyAccessToken)

router.post('/create', createFeedback)
router.get('/', isStaff || isAdmin, getFeedback)
router.delete('/:id', isStaff || isAdmin, deleteFeedback)

module.exports = router
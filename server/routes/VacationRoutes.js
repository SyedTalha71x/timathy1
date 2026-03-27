const express = require('express')

const {
    sendVacationRequest,
    getAllVacationRequest,
    approvedVacationRequest,
    rejectedVacationRequest,
    showAllPendingRequests
} = require('../controllers/VacationController')


const { verifyAccessToken } = require('../middleware/verifyToken')

const router = express.Router()

router.use(verifyAccessToken)

router.post('/send', sendVacationRequest)
router.get('/', getAllVacationRequest)
router.get('/pending', showAllPendingRequests)
// approved Request
router.patch('/:id/approved', approvedVacationRequest)

// rejected request
router.patch('/:id/rejected', rejectedVacationRequest)


module.exports = router
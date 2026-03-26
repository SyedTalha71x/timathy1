const express = require('express')

const { createTicket, getTicket, updateTicket, deleteTicket, isClosedTicket } = require('../controllers/TicketController')


const { verifyAccessToken } = require('../middleware/verifyToken')
const { uploadImage } = require('../config/upload')
const { isStaff, isAdmin } = require('../middleware/RoleCheck')

const router = express.Router()

router.use(verifyAccessToken)


router.post('/create', uploadImage.single('uploadedImages'), createTicket)
router.get('/', getTicket)
router.put('/:id', uploadImage.single('uploadedImagesBySupport'), updateTicket)
router.delete('/:id', isStaff || isAdmin, deleteTicket)


// patch to closed ticket

router.patch('/:id/closed', isClosedTicket)




module.exports = router
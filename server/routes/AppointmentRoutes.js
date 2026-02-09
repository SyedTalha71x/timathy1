const express = require('express')

const { createAppointment, getMyAppointment, cancelAppointment } = require('../controllers/AppointmentController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const router = express.Router()

router.post('/create', verifyAccessToken, createAppointment)
router.get('/myAppointments', verifyAccessToken, getMyAppointment)
router.patch('/:id/cancel', verifyAccessToken, cancelAppointment)

module.exports = router
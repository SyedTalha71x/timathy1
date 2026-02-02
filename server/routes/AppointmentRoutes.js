const express = require('express')

const { createAppointment, getMyAppointment } = require('../controllers/AppointmentController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const router = express.Router()

router.post('/create', verifyAccessToken, createAppointment)
router.get('/myAppointments', verifyAccessToken, getMyAppointment)


module.exports = router
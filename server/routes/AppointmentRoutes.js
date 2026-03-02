const express = require('express')

const { createAppointment, getMyAppointment, cancelAppointment, allAppointments, appointmentByMemberId, createAppointmentByStaff } = require('../controllers/AppointmentController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isStaff } = require('../middleware/RoleCheck')
const router = express.Router()

router.post('/create', verifyAccessToken, createAppointment)
router.get('/myAppointments', verifyAccessToken, getMyAppointment)
router.patch('/:id/cancel', verifyAccessToken, cancelAppointment)
router.get('/all-appointments', verifyAccessToken, isStaff,allAppointments);
router.get('/member/:memberId', verifyAccessToken, appointmentByMemberId);
router.post('/create/:memberId', verifyAccessToken, createAppointmentByStaff);
module.exports = router
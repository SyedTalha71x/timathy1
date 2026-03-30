const express = require('express')

const { createAppointment,
    getMyAppointment,
    cancelAppointment,
    allAppointments,
    appointmentByMemberId,
    createAppointmentByStaff,
    createBookingTrailByStaff,
    createBlockedAppointment,
    updateAppointmentById,
    deleteAppointmentById,
    approvedAppointment,
    rejectedAppointment,
    getAllPendingAppointment } = require('../controllers/AppointmentController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isStaff } = require('../middleware/RoleCheck')
const router = express.Router()

router.post('/create', verifyAccessToken, createAppointment)
router.post('/block', verifyAccessToken, isStaff, createBlockedAppointment);
router.post('/create/:memberId', verifyAccessToken, createAppointmentByStaff);
router.get('/myAppointments', verifyAccessToken, getMyAppointment)
router.patch('/:appointmentId/cancel', verifyAccessToken, cancelAppointment)
router.get('/all-appointments', verifyAccessToken, isStaff, allAppointments);
router.get('/member/:memberId', verifyAccessToken, appointmentByMemberId);
router.post('/trial/:leadId', verifyAccessToken, createBookingTrailByStaff);
router.put("/:appointmentId", verifyAccessToken, isStaff, updateAppointmentById)
router.delete("/:appointmentId", verifyAccessToken, isStaff, deleteAppointmentById)




// all new
router.patch('/approved/:appointmentId', approvedAppointment)
router.patch('/rejected/:appointmentId', rejectedAppointment)
router.get('/pending', getAllPendingAppointment)

module.exports = router
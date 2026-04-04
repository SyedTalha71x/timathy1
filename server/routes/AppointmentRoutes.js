const express = require('express')

const { createAppointment,
    getMyAppointment,
    cancelAppointment,
    allAppointments,
    appointmentByMemberId,
    createAppointmentByStaff,
    createBlockedAppointment,
    createBookingTrailByStaff,
    updateAppointmentById,
    deleteAppointmentById,
    getAllPendingAppointment,
    approvedAppointment,
    rejectedAppointment,

    // appointment Types
    createAppointmentTypes,
    updateAppointmentTypes,
    deleteAppointmentTypes,
    getAppointmentTypes,
    getAppointmentTypeById,
    bulkDeleteAppointmentTypes } = require('../controllers/AppointmentController')
const { verifyAccessToken } = require('../middleware/verifyToken')
const { isStaff } = require('../middleware/RoleCheck')
const { uploadImage } = require('../config/upload') // Add this for file upload
const router = express.Router()

// ========================
// EXISTING APPOINTMENT ROUTES (unchanged)
// ========================
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

// Appointment status routes
router.patch('/approved/:appointmentId', isStaff, approvedAppointment)
router.patch('/rejected/:appointmentId', isStaff, rejectedAppointment)
router.get('/pending', getAllPendingAppointment)

// ========================
// NEW APPOINTMENT TYPES ROUTES
// ========================
// Get all appointment types for a studio
router.get('/types', verifyAccessToken, isStaff, getAppointmentTypes)
// Get single appointment type by ID
router.get('/types/:typeId', verifyAccessToken, isStaff, getAppointmentTypeById)

// Create appointment type (with image upload)
router.post('/types/create', verifyAccessToken, isStaff, uploadImage.single('image'), createAppointmentTypes)

// Update appointment type (with optional image upload)
router.put('/types/:typeId', verifyAccessToken, isStaff, uploadImage.single('image'), updateAppointmentTypes)

// Delete appointment type
router.delete('/types/:typeId', verifyAccessToken, isStaff, deleteAppointmentTypes)

// Bulk delete appointment types
router.post('/types/bulk-delete', verifyAccessToken, isStaff, bulkDeleteAppointmentTypes)

module.exports = router
const express = require('express');
const router = express.Router();

const { verifyAccessToken } = require('../middleware/verifyToken');
const { isStaff, isAdmin } = require('../middleware/RoleCheck');
const { uploadImage } = require('../config/upload');

const {
    createLead,
    allLeads,
    updateLeadByStaff,
    getLeadById,
    getLeadsByConversionStatus,
    convertLead,
    deleteLead
} = require('../controllers/LeadController');

/**
 * Lead Routes
 * Base path: /api/leads
 * All routes require authentication
 */

router.use(verifyAccessToken);

/**
 * @route   POST /api/leads/create
 * @desc    Create a new lead
 * @access  Staff only
 * @body    multipart/form-data with lead data and optional image
 */
router.post('/create', isStaff, uploadImage.single('img'), createLead);

/**
 * @route   GET /api/leads/all
 * @desc    Get all leads with pagination and filtering
 * @access  Staff only
 * @query   page, limit, search, status, source, fromDate, toDate, sortBy, order
 */
router.get('/all', isStaff, allLeads);

/**
 * @route   GET /api/leads/status/:converted
 * @desc    Get leads by conversion status (true/false)
 * @access  Staff only
 * @param   converted - 'true' for converted, 'false' for pending
 */
router.get('/status/:converted', isStaff, getLeadsByConversionStatus);

/**
 * @route   GET /api/leads/:leadId
 * @desc    Get single lead by ID
 * @access  Staff only
 */
router.get('/:leadId', isStaff, getLeadById);

/**
 * @route   PUT /api/leads/:leadId
 * @desc    Update lead information
 * @access  Staff only
 * @body    multipart/form-data with lead data and optional image
 */
router.put('/staff/:leadId', isStaff, uploadImage.single('img'), updateLeadByStaff);

/**
 * @route   PATCH /api/leads/:leadId/convert
 * @desc    Mark lead as converted (to member)
 * @access  Staff only
 * @body    { memberId: "optional-member-id" }
 */
router.patch('/:leadId/convert', isStaff, convertLead);

/**
 * @route   DELETE /api/leads/:leadId
 * @desc    Delete a lead
 * @access  Admin only
 */
router.delete('/:leadId', isAdmin, deleteLead);

module.exports = router;
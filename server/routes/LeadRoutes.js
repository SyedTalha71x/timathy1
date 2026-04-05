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
    deleteLead,

    // lead sources
    createSource,
    updateSource,
    deleteSource,
    getSources

} = require('../controllers/LeadController');



router.use(verifyAccessToken);


router.post('/create', isStaff, uploadImage.single('img'), createLead);
router.get('/all', isStaff, allLeads);
router.get('/status/:converted', isStaff, getLeadsByConversionStatus);
router.put('/staff/:leadId', isStaff, uploadImage.single('img'), updateLeadByStaff);
router.patch('/:leadId/convert', isStaff, convertLead);
router.delete('/:leadId', isAdmin, deleteLead);


// lead sources

router.get('/sources/', getSources)
router.post('/sources/create', createSource)
router.put('/sources/:sourceId', updateSource)
router.delete('/sources/:sourceId', deleteSource)







router.get('/:leadId', isStaff, getLeadById);
module.exports = router;
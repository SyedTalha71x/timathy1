const express = require('express');
const {
    createStaff,
    loginStaff,
    updateStaffById,
    getStaffById,
    getStaff,
    deleteStaffById,
    updateById,
} = require('../controllers/StaffController');

const {
    uploadDocuments,
    deleteDocument,
    updateDocument,
    documentById,
    viewDocumentById,
    allDocumentByEntity
} = require('../controllers/documents/UploadDocumentController');
const { verifyAccessToken, verifyRefreshToken } = require('../middleware/verifyToken');
const { isAdmin, isStaff } = require('../middleware/RoleCheck');
const { uploadImage, uploadDocument } = require('../config/upload')
const router = express.Router();

router.post('/create', uploadImage.single('img'), isStaff || isAdmin, createStaff)
router.post('/login', loginStaff)



router.use(verifyAccessToken) // Apply token verification middleware to all routes below

router.get('/all', isStaff || isAdmin, getStaff)
router.get('/:staffId', getStaffById)
router.put('/update', uploadImage.single('img'), updateById)
router.put('/:staffId', uploadImage.single('img'), updateStaffById)
router.delete('/:staffId', deleteStaffById)


router.get('/view/:documentId', viewDocumentById);


// upload Documents
router.post("/:entityType/:entityId/upload", uploadDocument.array('documents', 10), uploadDocuments);

// Delete a document
router.delete("/:entityType/:entityId/:documentId", deleteDocument);

// Update document metadata
router.patch("/:documentId", updateDocument);
// get all documents for an entity
router.get("/:entityType/:entityId", allDocumentByEntity)
// get document by id
router.get("/details/:documentId", documentById)

// Add this to your document routes file

module.exports = router
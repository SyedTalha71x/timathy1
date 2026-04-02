const express = require('express');
const {
    // All Category related controllers
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,

    // All Class-types related controllers
    createClassType,
    getClassTypes,
    updateClassTypes,
    deleteClassType,

    // All classes related controllers
    createClassByStaff,
    getClasses,
    deleteClass,
    cancelClass,
    enrollMembersToClassByStaff,
    removeEnrolledMembers,
    updateClassById,
    enrollMyself,
    myClasses,

    // all room related controllers
    deleteRoom,
    updateRoom,
    getAllRoom,
    createRoom
} = require('../../controllers/classes/ClassTypeController');

const { verifyAccessToken } = require('../../middleware/verifyToken')
const { uploadImage } = require('../../config/upload')
const { isStaff, isMember } = require('../../middleware/RoleCheck')

const router = express.Router();

// Apply token verification to all routes
router.use(verifyAccessToken);

// ==================== CATEGORY ROUTES ====================
router.post('/category/create', createCategory);
router.get('/categories', getAllCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

// ==================== ROOM ROUTES ====================
router.post('/room/create', createRoom);
router.get('/rooms', getAllRoom);
router.put('/room/:roomId', updateRoom);
router.delete('/room/:roomId', deleteRoom);

// ==================== CLASS-TYPES ROUTES ====================
router.post('/type/create', uploadImage.single('img'), createClassType)
router.get('/types', getClassTypes)
router.put('/type/:typeId', uploadImage.single('img'), updateClassTypes)
router.delete('/type/:typeId', deleteClassType)

// ==================== CLASS ROUTES ====================
// GET routes first (to avoid path conflicts)
router.get('/', getClasses)
router.get('/my-classes', myClasses)

// POST routes
router.post('/create', createClassByStaff)

// PUT routes
router.put('/update/:classId', updateClassById)

// PATCH routes - order matters! More specific routes first
router.patch('/enroll/:classId', isStaff, enrollMembersToClassByStaff)  // Staff enrolls members
router.patch('/remove-enrolled/:classId', isStaff, removeEnrolledMembers)  // Staff removes members
router.patch('/cancel/:classId', isStaff, cancelClass)  // Staff cancels class
router.patch('/:classId/enroll', isMember, enrollMyself)  // Member enrolls themselves

// DELETE routes - put at the end
router.delete('/delete/:classId', isStaff, deleteClass)

module.exports = router;
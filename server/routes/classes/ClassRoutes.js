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

    // All classes related controllers can be added here
    createClassByStaff,
    getClasses,
    deleteClass,
    cancelClass,
    enrollMembersToClassByStaff,
    removeEnrolledMembers,
    updateClassById,
    enrollMyself,
    myClasses
} = require('../../controllers/classes/ClassTypeController');

const { verifyAccessToken } = require('../../middleware/verifyToken')
const { uploadImage } = require('../../config/upload')
const { isStaff } = require('../../middleware/roleCheck')

const router = express.Router();


router.use(verifyAccessToken);

// create Category Routes
router.post('/category/create', createCategory);
router.get('/categories', getAllCategories);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);


// create Class-Types Routes
router.post('/type/create', uploadImage.single('img'), createClassType)
router.get('/types', getClassTypes)
router.put('/type/:typeId', uploadImage.single('img'), updateClassTypes)
router.delete('/type/:typeId', deleteClassType)



// create Classes Routes here
router.post('/create', createClassByStaff)
router.get('/', getClasses)
router.get('/my-classes', myClasses)

router.put('/update/:classId', updateClassById)
router.delete('/delete/:classId', isStaff, deleteClass)




// patch
router.patch('/cancel/:classId', isStaff, cancelClass)
router.patch('/enroll/:classId', isStaff, enrollMembersToClassByStaff)
router.patch('/remove-enrolled/:classId', isStaff, removeEnrolledMembers)
router.patch('/:classId/enroll', isStaff, enrollMyself)


module.exports = router;
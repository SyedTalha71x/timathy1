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
} = require('../../controllers/classes/ClassTypeController');

const { verifyAccessToken } = require('../../middleware/verifyToken')
const { uploadImage } = require('../../config/upload')


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
router.put('/type/:classId', uploadImage.single('img'), updateClassTypes)
router.delete('/type/:classId', deleteClassType)



// create Classes Routes here

module.exports = router;
const express = require('express');
const { uploadImage } = require('../config/upload');
const {
  createService,
  deleteService,
  getServiceById,
  getAllServices,
  updateService,
  //   studioServices 

  // all category
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/ServiceController');
const { verifyAccessToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/RoleCheck');

const router = express.Router();

// Create a service (staff only)
router.post('/create', verifyAccessToken, isAdmin, uploadImage.single('image'), createService);

// Get all services for a studio (optional: studioId param)
router.get('/studio-services', verifyAccessToken, getAllServices);

// Get my services
// router.get('/studioServices', verifyAccessToken, studioServices);

// Get service by ID
router.get('/:id', verifyAccessToken, getServiceById);

// Delete a service
router.delete('/:id', verifyAccessToken, deleteService);
router.put('/:id', verifyAccessToken, uploadImage.single('image'), updateService);






// appointment categories

router.post('/category/create', verifyAccessToken, createCategory);
router.get('/categories', verifyAccessToken, getAllCategories);
router.put('/category/:id', verifyAccessToken, updateCategory);
router.delete('/category/:id', verifyAccessToken, deleteCategory);

module.exports = router;

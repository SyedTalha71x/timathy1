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
  deleteCategory,

  // Vat rate
  createVatRate,
  getAllVatRates,
  getVatRateById,
  updateVatRate,
  deleteVatRate
} = require('../controllers/ServiceController');
const { verifyAccessToken } = require('../middleware/verifyToken');
const { isAdmin, isStaff } = require('../middleware/RoleCheck');

const router = express.Router();

// Create a service (staff only)
router.post('/create', verifyAccessToken, isStaff || isAdmin, uploadImage.single('image'), createService);

// Get all services for a studio (optional: studioId param)
router.get('/studio-services', verifyAccessToken, getAllServices);

// Get my services
// router.get('/studioServices', verifyAccessToken, studioServices);

// Get service by ID

// Delete a service
router.delete('/:serviceId', verifyAccessToken, deleteService);
router.put('/:serviceId', verifyAccessToken, uploadImage.single('image'), updateService);






// appointment categories

router.post('/category/create', verifyAccessToken, createCategory);
router.get('/categories', verifyAccessToken, getAllCategories);
router.put('/category/:id', verifyAccessToken, updateCategory);
router.delete('/category/:id', verifyAccessToken, deleteCategory);



// vate rate

router.get('/vat-rates', verifyAccessToken, isStaff, getAllVatRates);
router.post('/vat-rates/create', verifyAccessToken, isStaff, createVatRate);
router.put('/vat-rates/:id', verifyAccessToken, isStaff, updateVatRate);
router.delete('/vat-rates/:id', verifyAccessToken, isStaff, deleteVatRate);



router.get('/vat-rates/:id', verifyAccessToken, isStaff, getVatRateById);
router.get('/:id', verifyAccessToken, getServiceById);

module.exports = router;

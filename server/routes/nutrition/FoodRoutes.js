const express = require('express');
const router = express.Router()

const { createFood, getFood, getFoodByBarcode } = require('../../controllers/NutritentsController/FoodController');
const { verifyAccessToken } = require('../../middleware/verifyToken')
const { isAdmin } = require('../../middleware/RoleCheck')

router.post('/create-food', verifyAccessToken, isAdmin, createFood)
router.get('/get-food', verifyAccessToken, getFood)
router.get('/barcode/:code', verifyAccessToken, getFoodByBarcode)

module.exports = router
const express = require('express');
const router = express.Router()
//  food controller 
const { getFood, getFoodByBarcode, addFoodById } = require('../../controllers/NutritentsController/FoodController');

// dailyLogs
const { myDailySummery } = require('../../controllers/NutritentsController/DailyLogController')

const { verifyAccessToken } = require('../../middleware/verifyToken')
const { isAdmin } = require('../../middleware/RoleCheck')

router.post('/create-food', verifyAccessToken, addFoodById)
router.get('/get-food', verifyAccessToken, getFood)
router.get('/barcode/:code', verifyAccessToken, getFoodByBarcode)

// daily log summery

router.get('/daily-summery', verifyAccessToken, myDailySummery);


module.exports = router
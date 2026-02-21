const express = require('express');

const router = express.Router()
const { createMyGoals } = require('../../controllers/NutritentsController/userGoalsController');
const { verifyAccessToken } = require('../../middleware/verifyToken')


router.post('/create-goal', verifyAccessToken, createMyGoals);

module.exports = router
const express = require('express');
const router = express.Router();
const { createPlan, showMyPlan,updateTrainingPlan } = require('../controllers/TrainingPlanController');
const { verifyAccessToken } = require('../middleware/verifyToken');

router.post('/create', verifyAccessToken, createPlan);
router.get('/myPlan', verifyAccessToken, showMyPlan);
router.put('/update/:planId', verifyAccessToken, updateTrainingPlan);
module.exports = router;